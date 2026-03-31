from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

try:
    from rag_service.rag_pipeline import analyze_case_text, build_default_query_config
except ModuleNotFoundError:
    from rag_pipeline import analyze_case_text, build_default_query_config

app = FastAPI(title="Nyaay Sahayak RAG Service")


class AnalyzeRequest(BaseModel):
    text: str


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
        config = build_default_query_config()
        result = analyze_case_text(text, config)
    except FileNotFoundError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"RAG analysis failed: {error}") from error

    return result
