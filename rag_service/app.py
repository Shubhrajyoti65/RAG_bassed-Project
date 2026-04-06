from fastapi import FastAPI, HTTPException, File, UploadFile
from pydantic import BaseModel

try:
    from rag_service.rag_pipeline import analyze_case_text, build_default_query_config, transcribe_audio
except ModuleNotFoundError:
    from rag_pipeline import analyze_case_text, build_default_query_config, transcribe_audio

app = FastAPI(title="Nyaay Sahayak RAG Service")


class AnalyzeRequest(BaseModel):
    text: str
    category: str = "general"
    language: str = "English"

def enrich_property_query(text: str, category: str) -> str:
    if category.lower() == "property":
        legal_terms = (
            " illegal possession encroachment "
            " title dispute land dispute "
            " boundary dispute trespass "
            " recovery of possession "
            " civil suit injunction "
            " unauthorized construction "
            " neighbour wall dispute "
            " immovable property "
            " land ownership "
            " plot dispute "
            " ancestral land "
        )
        return text + legal_terms

    return text


# FastAPI endpoint to perform RAG-based analysis on user-provided case text
@app.post("/analyze")
def analyze(payload: AnalyzeRequest):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    if len(text) < 50:
        raise HTTPException(
            status_code=400,
            detail="Case description is too short. Provide at least 50 characters.",
        )
    if len(text) > 50000:
        raise HTTPException(
            status_code=400,
            detail="Case description is too long. Maximum 50,000 characters allowed.",
        )

    try:
        config = build_default_query_config(payload.category)
        text = enrich_property_query(text, payload.category)
        
        # Pass the desired output language to the pipeline
        config.output_language = payload.language
        
        result = analyze_case_text(text, config)
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"RAG analysis failed: {error}") from error

    return result


# FastAPI endpoint to handle voice queries (auto-detect language + RAG)
@app.post("/analyze-voice")
async def analyze_voice(file: UploadFile = File(...), category: str = "general"):
    """
    Receives an audio file, transcribes it, detects the language, 
    and then performs a legal RAG analysis.
    """
    if not file:
        raise HTTPException(status_code=400, detail="Audio file is required")
    
    # Read file bytes
    try:
        audio_bytes = await file.read()
        mime_type = file.content_type or "audio/webm"
    except Exception as read_error:
        raise HTTPException(status_code=400, detail=f"Failed to read audio file: {read_error}")
    
    try:
        # Load base configuration
        config = build_default_query_config(category)
        
        # 1. Automatic Transcription and Language Detection using Gemini 1.5
        transcription_text, detected_lang = transcribe_audio(audio_bytes, mime_type, config)
        
        if not transcription_text.strip() or len(transcription_text) < 5:
            raise HTTPException(
                status_code=400, 
                detail="Voice input was too short or could not be transcribed."
            )
            
        # 2. Execute the RAG Pipeline with the detected context
        # We manually update the config with the detected language
        config.output_language = detected_lang
        
        # Optional: Enrich text for property category as in the text flow
        text_to_analyze = enrich_property_query(transcription_text, category)
        
        result = analyze_case_text(text_to_analyze, config)
        
        # Append metadata about the voice processing to the response
        result["transcription"] = transcription_text
        result["detectedLanguage"] = detected_lang
        
        return result
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        print(f"Voice analysis pipeline failed: {error}")
        raise HTTPException(status_code=500, detail=f"Voice analysis failed: {error}")
