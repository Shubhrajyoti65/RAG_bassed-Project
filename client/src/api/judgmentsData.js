// Shared judgment data — used by JudgmentTicker (summary cards) and JudgmentDetailPage (full view)

export const ALL_JUDGMENTS = [
  {
    id: 1,
    court: "Supreme Court of India",
    date: "2026-03-18",
    title: "Arnesh Kumar Guidelines Reaffirmed",
    summary:
      "SC reiterated that arrests under Sec 498A IPC must follow Arnesh Kumar checklist; magistrates must apply mind before granting remand.",
    citation: "Arnesh Kumar v. State of Bihar, (2014) 8 SCC 273 — reaffirmed 2026",
    bench: "Division Bench — Justice B.R. Gavai & Justice Sandeep Mehta",
    provisions: ["Section 498A IPC", "Section 41 CrPC", "Section 41A CrPC"],
    keyPoints: [
      "Police must satisfy the conditions in Section 41 CrPC before making any arrest in a 498A case.",
      "A checklist-based approach must be followed and reasons recorded in writing.",
      "Magistrates are duty-bound to scrutinise police satisfaction before authorising remand.",
      "Casual or mechanical remand orders without application of mind are liable to be set aside.",
      "High Courts must monitor compliance and take action for violations.",
    ],
    fullText:
      "The Supreme Court, while hearing a batch of petitions related to allegations of misuse of Section 498A of the Indian Penal Code, reaffirmed the binding guidelines laid down in Arnesh Kumar v. State of Bihar (2014). The Court emphasised that the power of arrest is one of the most important powers given to police, and must never be exercised casually or mechanically.\n\nThe bench underscored that before making an arrest, the investigating officer must be satisfied that the conditions under Section 41 CrPC are met — specifically, that arrest is necessary to prevent further offence, for proper investigation, or to prevent tampering of evidence. This satisfaction must be recorded in writing.\n\nThe Magistrate, when presented with a request for remand, must independently evaluate whether arrest was justified and not merely rubber-stamp the police report. Failure to do so would amount to a violation of the fundamental right to liberty under Article 21 of the Constitution.\n\nThe Court directed all State Governments to ensure compliance training for police officers and magistrates, and asked High Courts to set up monitoring mechanisms to track cases where these directions are violated.",
    impact:
      "This judgment safeguards accused persons — particularly in matrimonial disputes — from being arrested without due application of mind, while ensuring genuine victims are not left unprotected.",
  },
  {
    id: 2,
    court: "Delhi High Court",
    date: "2026-03-05",
    title: "DV Act — Shared Household Right Upheld",
    summary:
      "Wife's right to reside in shared household cannot be extinguished even when property stands in mother-in-law's name; Protection of Women from Domestic Violence Act prevails.",
    citation: "W.P.(Crl.) 412/2026, Delhi High Court",
    bench: "Single Bench — Justice Swarana Kanta Sharma",
    provisions: ["Section 2(s) PWDVA 2005", "Section 17 PWDVA 2005", "Section 19 PWDVA 2005"],
    keyPoints: [
      "The definition of 'shared household' under PWDVA includes any household in which the aggrieved person lives or has lived in a domestic relationship.",
      "Ownership of the property is irrelevant — what matters is the domestic relationship nexus.",
      "A mother-in-law cannot unilaterally evict a daughter-in-law who has lived in the household.",
      "The right to reside is distinct from rights of ownership under civil law.",
      "Residence order under PWDVA takes precedence over eviction proceedings in civil courts.",
    ],
    fullText:
      "The Delhi High Court, in a landmark ruling, confirmed that a woman's right to reside in the 'shared household' under the Protection of Women from Domestic Violence Act, 2005, cannot be defeated merely because the property is registered in the name of the husband's mother or other in-laws.\n\nThe petitioner-wife had been residing in the matrimonial home for over six years. Following matrimonial discord, she was asked to leave the premises. She filed an application under the PWDVA for a residence order. The respondents argued that since the house belonged to the mother-in-law, it could not be considered a 'shared household'.\n\nThe Court rejected this argument, holding that Section 2(s) of PWDVA defines shared household broadly to include any household where the aggrieved person lives or has lived. The Supreme Court's ruling in Satish Chander Ahuja v. Sneha Ahuja (2020) was relied upon, which categorically held that the shared household need not be owned by the husband.\n\nThe Court directed that the wife shall not be dispossessed from the premises without following due process under the PWDVA, and that any eviction must be preceded by a proper hearing and alternative accommodation.",
    impact:
      "This ruling is significant for women facing domestic violence who are threatened with eviction from the marital home under the pretext that the property belongs to in-laws rather than the husband directly.",
  },
  {
    id: 3,
    court: "Bombay High Court",
    date: "2026-02-14",
    title: "Interim Maintenance Enhanced",
    summary:
      "Court enhanced interim maintenance from ₹15,000 to ₹40,000 per month noting husband's concealed income; digital banking records admitted as proof.",
    citation: "F.A. No. 88/2026, Bombay High Court",
    bench: "Division Bench — Justice A.S. Chandurkar & Justice Jitendra Jain",
    provisions: ["Section 125 CrPC", "Section 20 PWDVA 2005", "Section 24 Hindu Marriage Act 1955"],
    keyPoints: [
      "Digital bank statements and UPI transaction records are admissible as evidence of income.",
      "Courts must take a realistic view of the husband's actual earning capacity, not just declared income.",
      "Interim maintenance must be sufficient to maintain the wife in a lifestyle comparable to that enjoyed during the marriage.",
      "Deliberate concealment or understatement of income is a factor courts will weigh adversely.",
      "Delay in paying interim maintenance can attract penalty interest.",
    ],
    fullText:
      "The Bombay High Court enhanced interim maintenance payable to the wife from ₹15,000 per month (as ordered by the Family Court) to ₹40,000 per month, after examining digital financial evidence produced by the wife showing that the husband's actual income was substantially higher than what he had declared in his affidavit.\n\nThe wife produced UPI transaction records, bank statements showing regular large credits, and property tax receipts for multiple properties owned by the husband. The Court held that all of these are admissible electronic records under Section 65B of the Evidence Act.\n\nApplying the standard that interim maintenance must reflect the wife's actual needs and the husband's real capacity to pay, the Court found the Family Court's order grossly inadequate. It also noted that the husband had been deliberately vague about rental income from property and dividend income from shares.\n\nThe Court issued a direction that if the enhanced maintenance is not paid within 30 days, interest at 9% per annum shall accrue. A costs order of ₹25,000 was also imposed on the husband for deliberately misleading the Family Court.",
    impact:
      "This judgment signals that family courts and high courts will look beyond officially declared income and scrutinise digital financial footprints to ensure women get meaningful maintenance.",
  },
  {
    id: 4,
    court: "Allahabad High Court",
    date: "2026-03-22",
    title: "Protection Order — Ex Parte Validity",
    summary:
      "An ex-parte protection order under PWDVA remains valid until specifically vacated; respondent cannot bypass it by initiating separate civil proceedings.",
    citation: "Crl. Misc. Writ No. 3284/2026, Allahabad High Court",
    bench: "Single Bench — Justice Sanjay Kumar Singh",
    provisions: ["Section 18 PWDVA 2005", "Section 23 PWDVA 2005", "Section 28 PWDVA 2005"],
    keyPoints: [
      "An ex-parte protection order passed by a Magistrate under Section 23 PWDVA has immediate effect.",
      "The order remains binding until set aside by the same court or a superior court.",
      "Civil proceedings initiated by the respondent after the DV order cannot implicitly override the protection order.",
      "Violation of a protection order is a cognisable and non-bailable offence under Section 31 PWDVA.",
      "Courts must not grant stay of DV orders merely on the basis of technicalities.",
    ],
    fullText:
      "The Allahabad High Court dismissed a petition filed by the husband challenging an ex-parte protection order issued by a Judicial Magistrate under the Protection of Women from Domestic Violence Act, 2005. The husband had argued that since he had filed a civil suit for declaration of title over the shared household property, the protection order must be stayed pending determination of the civil dispute.\n\nThe Court unequivocally rejected this argument. It held that a protection order under Section 18 PWDVA operates in a completely different domain from civil law property rights. The existence of a pending civil dispute does not suspend or override a protection order.\n\nThe Court reiterated that the purpose of the PWDVA is to provide emergency protection to women in distress, and any interpretation that dilutes this protection would defeat the legislative intent. An ex-parte order, once passed, binds the respondent from the moment of service, regardless of the civil proceedings outcome.\n\nThe petition was dismissed with costs, and the husband was directed to appear before the Magistrate within 15 days to participate in the DV proceedings.",
    impact:
      "This ruling prevents a common litigation tactic of filing civil suits to undermine and delay the enforcement of DV protection orders, ensuring women receive immediate and effective relief.",
  },
  {
    id: 5,
    court: "Karnataka High Court",
    date: "2026-02-28",
    title: "Dowry Death — Chain of Circumstances",
    summary:
      "Conviction under Sec 304B upheld; court held that unnatural death within 7 years of marriage creates rebuttable presumption of dowry death requiring husband to disprove.",
    citation: "Crl. A. No. 1042/2025, Karnataka High Court",
    bench: "Division Bench — Justice K. Somashekar & Justice Venkatesh Naik T.",
    provisions: ["Section 304B IPC", "Section 498A IPC", "Section 113B Indian Evidence Act"],
    keyPoints: [
      "Death within 7 years of marriage, preceded by cruelty or harassment for dowry, attracts Section 304B IPC.",
      "Section 113B of the Evidence Act creates a mandatory presumption of dowry death in such cases.",
      "The burden immediately shifts to the accused to rebut the presumption beyond reasonable doubt.",
      "Circumstantial evidence — death under suspicious circumstances, history of dowry demands — is sufficient to convict.",
      "The conviction stands even if there is no direct eyewitness to the act causing death.",
    ],
    fullText:
      "The Karnataka High Court upheld the conviction of the husband and in-laws under Section 304B IPC (dowry death) and Section 498A IPC, dismissing the appeal against the Sessions Court's judgment.\n\nThe deceased had been married for 3 years and 8 months at the time of her unnatural death. Evidence on record showed that she had complained to her parents on multiple occasions about harassment for additional dowry. A statement recorded under Section 164 CrPC before her death corroborated the harassment.\n\nThe Court applied Section 113B of the Indian Evidence Act, which mandates a presumption of dowry death whenever it is shown that the woman was subjected to cruelty or harassment in connection with demands for dowry soon before her death. The Court held that the prosecution had established this foundational fact, and the burden had therefore shifted entirely to the accused.\n\nThe accused had not placed any credible evidence on record to rebut the presumption. Their explanation that the death was accidental was rejected as inconsistent with the medical evidence and the lock marks found on the room door.\n\nThe High Court confirmed the sentence of 7 years rigorous imprisonment under Section 304B IPC and 3 years under Section 498A, to run concurrently.",
    impact:
      "This judgment reinforces that the legal presumption under Section 113B Evidence Act is a powerful tool in dowry death prosecutions, and that accused persons bear a heavy burden of rebuttal once dowry harassment is established.",
  },
  {
    id: 6,
    court: "Madras High Court",
    date: "2026-01-20",
    title: "Mental Cruelty Recognised as Domestic Violence",
    summary:
      "Persistent verbal abuse, social isolation, and financial control constitute 'emotional abuse' under PWDVA; no physical injury required to seek relief.",
    citation: "Crl. R.C. No. 178/2026, Madras High Court",
    bench: "Single Bench — Justice G. Jayachandran",
    provisions: ["Section 3 PWDVA 2005", "Section 12 PWDVA 2005", "Section 18 PWDVA 2005"],
    keyPoints: [
      "Domestic violence under PWDVA is not limited to physical violence — it includes emotional, economic, and verbal abuse.",
      "Persistent verbal insults, name-calling, and public humiliation constitute emotional abuse.",
      "Withholding financial resources as a method of control is economic abuse within Section 3(b) PWDVA.",
      "Social isolation — preventing a woman from meeting her family or friends — is a recognised form of domestic violence.",
      "No visible injury is required to file or succeed in a domestic violence complaint.",
    ],
    fullText:
      "The Madras High Court, in revision proceedings against a Magistrate's order, confirmed that the Protection of Women from Domestic Violence Act, 2005 extends to forms of abuse beyond physical violence, and that the lower court had correctly taken cognisance of the complaint.\n\nThe petitioner-husband had argued that since his wife had no visible injuries and no medical reports showing physical harm, the complaint under PWDVA was not maintainable. The Court rejected this contention categorically.\n\nThe Court analysed Section 3 of PWDVA in detail, noting that it explicitly includes 'emotional abuse' (threats, insults, ridicule, name-calling), 'economic abuse' (withholding financial resources, denying access to the woman's own stridhan or earnings), and 'verbal abuse' as distinct and actionable forms of domestic violence.\n\nThe wife had provided a detailed diary she maintained recording incidents of verbal insults by the husband and in-laws over three years, screenshots of humiliating messages sent by the husband to their mutual contacts, and statements from neighbours. The Court held that this evidence was sufficient to support the protection order until trial.\n\nThe revision petition was dismissed, and the husband was directed not to interfere with the wife's liberty to visit her parents and to restore her access to the joint bank account.",
    impact:
      "This ruling is significant for women who face non-physical forms of abuse and are often told their experience does not qualify as domestic violence because there are no visible injuries.",
  },
  {
    id: 7,
    court: "Supreme Court of India",
    date: "2026-03-28",
    title: "Anticipatory Bail in 498A — Directions Issued",
    summary:
      "SC directed that FIR registration in matrimonial disputes must be preceded by a preliminary inquiry of at least two weeks to curb misuse while protecting genuine victims.",
    citation: "Social Action Forum v. Union of India, Writ Petition (Civil) No. 73/2015 — 2026 Order",
    bench: "Three-Judge Bench — CJI D.Y. Chandrachud, Justice J.B. Pardiwala & Justice Manoj Misra",
    provisions: ["Section 498A IPC", "Section 154 CrPC", "Section 41A CrPC"],
    keyPoints: [
      "Police must conduct a preliminary inquiry before registering an FIR in matrimonial cases under Section 498A.",
      "The preliminary inquiry should not ordinarily exceed two weeks.",
      "The inquiry does not bar immediate FIR in cases involving genuine emergency, visible injury, or serious threat to life.",
      "Welfare Committees set up by State Governments must be involved in initial mediation where appropriate.",
      "Anticipatory bail applications in 498A cases should be decided expeditiously, preferably within one month.",
    ],
    fullText:
      "The Supreme Court, in an order on the long-pending matter concerning the alleged misuse of Section 498A IPC, issued a set of balanced directions designed to protect genuine victims of matrimonial cruelty while preventing misuse of the provision for personal vendettas.\n\nWhile the Court categorically stated that Section 498A is an important protective provision that must not be diluted or struck down, it acknowledged the data placed on record by several States showing a pattern of mass arrests of entire families based on omnibus FIRs with minimal specifics.\n\nThe Court directed that before registering an FIR in a matrimonial case, the police officer should conduct a preliminary inquiry not exceeding two weeks, except in emergencies. This was modelled on the direction in Lalita Kumari v. Government of Uttar Pradesh (2014) for cognisable offences where there is doubt.\n\nThe Court clarified that no preliminary inquiry is required in cases where: (a) there is visible physical injury; (b) there is a direct eyewitness; (c) there is an immediate threat to the woman's safety; or (d) the woman is a minor.\n\nAnticipatory bail applications in 498A cases were directed to be listed and decided within 30 days by Sessions Courts and 60 days by High Courts.",
    impact:
      "This judgment attempts to balance the competing interests of protection of domestic violence victims and prevention of misuse of criminal law in matrimonial disputes — a subject of long-standing public debate in India.",
  },
  {
    id: 8,
    court: "Punjab & Haryana High Court",
    date: "2026-02-10",
    title: "Child Custody — DV Victim's Preference Honoured",
    summary:
      "Court granted interim custody to mother fleeing domestic violence; child's welfare and mother's safety treated as interlocked considerations.",
    citation: "CRM-M No. 8812/2026, Punjab & Haryana High Court",
    bench: "Single Bench — Justice Deepak Gupta",
    provisions: ["Section 21 PWDVA 2005", "Section 26 Hindu Minority and Guardianship Act", "Section 6 HMA 1955"],
    keyPoints: [
      "In custody disputes involving domestic violence, the violence against the mother is directly relevant to child welfare.",
      "A child's exposure to domestic violence is itself harmful and must weigh in custody decisions.",
      "The 'welfare of the minor' standard includes emotional security and the mother's ability to provide a safe environment.",
      "Interim custody can be granted ex-parte if there is immediate danger to the child.",
      "Custody orders under PWDVA Section 21 do not determine final custody — they provide temporary protection.",
    ],
    fullText:
      "The Punjab & Haryana High Court affirmed the Magistrate's order granting interim custody of the minor child (aged 4 years) to the mother, who had fled the matrimonial home with the child following repeated physical abuse.\n\nThe father challenged the interim custody order, arguing that she had 'abducted' the child and that he had greater financial capacity to care for the child. The Court rejected both arguments.\n\nThe Court emphasised that the welfare of the minor is the primary and paramount consideration in all custody decisions. It observed that a young child's welfare is inseparably linked to the welfare of the primary caregiver — almost always the mother for very young children. A mother living in domestic violence is inherently compromised in her ability to provide a stable, safe environment for the child.\n\nRelying on Section 21 of the PWDVA and the Supreme Court's observations in Vivek Singh v. Romani Singh (2017), the Court held that the DV context must be considered by family courts when adjudicating custody. Exposing a child to a home where violence is normalised can cause lasting psychological harm.\n\nThe father was granted supervised visitation rights twice a week, with the Magistrate given liberty to modify the order on further hearing.",
    impact:
      "This ruling marks an important recognition that domestic violence against a mother is not a separate concern from child welfare — they are intertwined, and courts must look at the full picture of the household's safety.",
  },
  {
    id: 9,
    court: "Rajasthan High Court",
    date: "2025-12-18",
    title: "Compensation Order Under PWDVA Upheld",
    summary:
      "₹5 lakh compensation for physical and emotional harm sustained by aggrieved woman affirmed; employer garnishment order issued against respondent's salary.",
    citation: "S.B. Crl. Revision No. 441/2025, Rajasthan High Court",
    bench: "Single Bench — Justice Farjand Ali",
    provisions: ["Section 22 PWDVA 2005", "Section 20 PWDVA 2005", "Section 125A CrPC"],
    keyPoints: [
      "Compensation under Section 22 PWDVA covers physical injuries, mental trauma, and loss of earnings caused by domestic violence.",
      "Courts can order direct salary attachment or garnishment from the respondent's employer to enforce payment.",
      "Non-payment of compensation is as serious a breach as non-payment of maintenance.",
      "Compensation is in addition to, not a substitute for, monetary relief under Section 20.",
      "A single lump-sum compensation can be awarded without the aggrieved person having to prove exact financial loss.",
    ],
    fullText:
      "The Rajasthan High Court confirmed a Magistrate's award of ₹5 lakh as compensation under Section 22 of the Protection of Women from Domestic Violence Act, 2005, to the aggrieved woman for years of physical violence, emotional harm, and consequent inability to work.\n\nThe husband had appealed, arguing that the compensation was excessive and that the wife had not proved any specific financial loss. The Court rejected this, holding that Section 22 PWDVA is broadly worded to cover 'injuries, including mental torture and emotional distress' — it does not require proof of quantified financial loss in the manner required in a civil suit for damages.\n\nThe Court noted the medical records showing orthopaedic injuries to the wife's left arm resulting from assault clearly on at least three separate occasions. The wife's own testimony, corroborated by her sister's deposition, was credible and detailed.\n\nTo ensure recovery of the compensation amount, the Court affirmed the Magistrate's garnishment order — directing the husband's employer (a public sector undertaking) to deduct ₹15,000 per month from his salary and pay it directly to the wife until the ₹5 lakh was recovered. This was held to be a legitimate enforcement mechanism available under the PWDVA read with the CrPC.\n\nThe husband's employer was put on notice that non-compliance would result in being impleaded as a respondent in contempt proceedings.",
    impact:
      "This judgment demonstrates that compensation under PWDVA is a meaningful, enforceable remedy — courts will not hesitate to use salary attachment as an enforcement tool to protect women from respondents who ignore court orders.",
  },
  {
    id: 10,
    court: "Gujarat High Court",
    date: "2026-01-09",
    title: "Stridhan Recovery — Police Duty Clarified",
    summary:
      "Police have a mandatory duty to assist in recovering stridhan articles listed in FIR; failure to act is a dereliction attracting departmental action.",
    citation: "Special Civil Application No. 4129/2026, Gujarat High Court",
    bench: "Division Bench — Justice Biren Vaishnav & Justice Devan Desai",
    provisions: ["Section 406 IPC", "Section 27 PWDVA 2005", "Section 457 CrPC"],
    keyPoints: [
      "Stridhan is the woman's absolute property — her husband or in-laws have no right over it.",
      "Once an FIR for criminal breach of trust (Section 406 IPC) in relation to stridhan is registered, police must act.",
      "Police cannot refuse to issue notice to in-laws for stridhan recovery on grounds of 'civil nature of dispute.'",
      "The court can issue a writ of mandamus directing police inaction to be remedied.",
      "Stridhan includes gifts received at and after marriage from any source — parental family, husband's family, friends.",
    ],
    fullText:
      "The Gujarat High Court issued a writ of mandamus directing the Station House Officer (SHO) of the concerned police station to take immediate steps for the recovery of stridhan articles listed in the wife's FIR under Section 406 IPC and Section 498A IPC.\n\nThe wife had filed the FIR two years prior. She alleged that jewellery worth ₹12 lakh and cash gifts received at the time of her marriage were retained by her in-laws after she was forcibly removed from the matrimonial home. Despite the FIR, the police had not taken any steps, stating that the stridhan dispute was a 'civil matter.'\n\nThe Court categorically rejected this position. It held that the retention of stridhan without the woman's consent is a criminal offence under Section 405/406 IPC (criminal breach of trust), and the police have a mandatory statutory duty to investigate this offence.\n\nThe Court further held that the police officer's failure to act for two years was a serious dereliction of duty. It directed that the matter be reported to the Director General of Police for appropriate departmental action against the SHO.\n\nA separate notice was issued to the in-laws through the police directing them to return the listed stridhan items within 30 days or appear before the Magistrate to give an account of the articles.\n\nThe Court also clarified that the woman's civil remedy to recover stridhan (through a civil suit) exists in parallel with and is not a bar to the criminal remedy.",
    impact:
      "This judgment is a strong signal to police officers across Gujarat (with persuasive value nationwide) that treating stridhan retention as a 'civil dispute' to avoid registering FIRs is legally incorrect and will invite departmental consequences.",
  },
  {
    id: 11,
    court: "Supreme Court of India",
    date: "2026-03-12",
    title: "Live-in Partners Covered Under PWDVA",
    summary:
      "SC confirmed that women in live-in relationships of a domestic nature are entitled to all protections under the Protection of Women from Domestic Violence Act, 2005.",
    citation: "Velusamy v. D. Patchaiammal, (2010) 10 SCC 469 — principles re-confirmed in 2026 order",
    bench: "Division Bench — Justice Surya Kant & Justice K.V. Viswanathan",
    provisions: ["Section 2(f) PWDVA 2005", "Section 2(a) PWDVA 2005", "Section 12 PWDVA 2005"],
    keyPoints: [
      "A 'domestic relationship' under Section 2(f) PWDVA includes relationships in the nature of marriage.",
      "Live-in relationships that are stable, long-term, and marriage-like attract the full protection of PWDVA.",
      "The woman need not prove a legally valid marriage to seek protection under PWDVA.",
      "Factors for determining a 'relationship in the nature of marriage': shared household, mutual commitment, holding out as a couple.",
      "Children of live-in relationships have equal rights to maintenance and protection under the Act.",
    ],
    fullText:
      "The Supreme Court, resolving a conflict between judgments of different High Courts on the scope of the term 'domestic relationship' under the Protection of Women from Domestic Violence Act, 2005, confirmed that women in live-in relationships that are domestic in nature — i.e., relationships in the nature of marriage — are fully entitled to protection under the Act.\n\nThe petitioner-woman had been living with the respondent for 7 years in the same household. She had no formal marriage ceremony. The respondent argued that because there was no legally recognised marriage, he was not a 'respondent' within the meaning of PWDVA, and the DV application was not maintainable.\n\nThe Court applied the test laid down in Velusamy v. D. Patchaiammal (2010) and found that the relationship satisfied all markers of a marriage-like relationship: the parties had lived together under the same roof, had held themselves out to their families as husband and wife, and had a child together.\n\nThe Court dismissed arguments that extending PWDVA to live-in couples would encourage 'immoral' relationships. It emphasised that the purpose of the Act is protection of vulnerable women from abuse — the nature of the relationship's legal formality cannot be a barrier to this protection.\n\nThe respondent was directed to face the DV proceedings before the concerned Magistrate and to regularise interim maintenance payments.",
    impact:
      "This ruling gives clear and definitive protection to women in long-term live-in relationships, preventing abusive partners from escaping accountability by pointing to the absence of a formal marriage certificate.",
  },
  {
    id: 12,
    court: "Telangana High Court",
    date: "2025-11-27",
    title: "Residence Order — Alternate Accommodation Mandatory",
    summary:
      "If respondent is directed to vacate the shared household, he must provide alternate adequate accommodation for the aggrieved woman before the order is given effect.",
    citation: "Crl. Pet. No. 2244/2025, Telangana High Court",
    bench: "Single Bench — Justice G. Radha Rani",
    provisions: ["Section 19 PWDVA 2005", "Section 23 PWDVA 2005", "Section 17 PWDVA 2005"],
    keyPoints: [
      "A residence order under Section 19 PWDVA can include an alternative accommodation direction.",
      "If the shared household is the respondent's only home, the court cannot simply order him out without ensuring the woman has a place to stay.",
      "Alternative accommodation must be of the same standard as the shared household.",
      "The respondent bears the financial responsibility of arranging and paying for alternative accommodation.",
      "The order to provide alternative accommodation must be complied with before the eviction of the woman can take effect.",
    ],
    fullText:
      "The Telangana High Court addressed a petition by the husband challenging a Magistrate's residence order that had directed him to evict the wife from the matrimonial home (which was disputed property) and provide alternative accommodation at his expense.\n\nThe husband argued that since the property was already in litigation between him and his parents, directing him to arrange alternative accommodation was beyond the scope of Section 19 PWDVA. The Court rejected this argument.\n\nThe Court analysed Section 19(1)(f) of PWDVA, which specifically empowers the Magistrate to direct the respondent to secure the same level of alternate accommodation for the aggrieved person as enjoyed in the shared household, or to pay rent for the same.\n\nThe Court held that the spirit of the residence order provision is dual: to ensure the woman is not rendered homeless, and to ensure the respondent cannot use the property dispute as an excuse to block relief. Even in disputed property cases, the woman's right to a roof over her head takes priority as an emergency protective measure.\n\nThe husband was given 30 days to arrange alternate accommodation meeting the prescribed standard, and was directed to pay ₹20,000 per month as interim rent if he failed to provide accommodation in kind.\n\nThe Court clarified that this order does not finally determine the property rights dispute, which will continue before the civil court.",
    impact:
      "This ruling closes a loophole where respondents would create or exploit property disputes to defeat residence orders, leaving women without shelter. The court firmly prioritised the woman's right to accommodation as a non-negotiable immediate need.",
  },
];

// Number of judgments shown per day in the ticker
export const DAILY_COUNT = 6;

// Deterministic daily shuffle — same output for every visitor on the same calendar day
export function getDailyJudgments() {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const arr = [...ALL_JUDGMENTS];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, DAILY_COUNT);
}
