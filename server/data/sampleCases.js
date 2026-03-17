const sampleCases = [
  {
    caseTitle: "Smt. Rani Devi v. Rajesh Kumar & Ors.",
    year: 2019,
    caseNumber: "Criminal Appeal No. 1234/2019",
    facts:
      "The appellant wife filed a complaint under the Protection of Women from Domestic Violence Act 2005 alleging physical abuse by her husband and in-laws. She stated that after marriage, her husband and mother-in-law subjected her to cruelty demanding additional dowry of Rs. 5 lakhs. She was beaten regularly and denied food. Medical records showed multiple contusions on arms and back. She was eventually driven out of the matrimonial home with her two minor children.",
    legalReasoning:
      "The Court examined the evidence including medical reports and witness testimonies. It held that the definition of domestic violence under Section 3 of the DV Act is wide enough to include physical, emotional, and economic abuse. The consistent medical evidence corroborated the appellant's claims. The Court relied on the precedent that even a single act of violence is sufficient to invoke the protections of the Act.",
    decision:
      "Appeal allowed; protection order and residence order granted in favor of the appellant under Sections 18 and 19 of the DV Act.",
    relevantSections: [
      "Section 3, DV Act 2005",
      "Section 12, DV Act 2005",
      "Section 18, DV Act 2005",
      "Section 19, DV Act 2005",
      "Section 498A, IPC",
    ],
  },
  {
    caseTitle: "Smt. Priya Sharma v. Anil Sharma",
    year: 2020,
    caseNumber: "Writ Petition No. 5678/2020",
    facts:
      "The petitioner filed for maintenance and monetary relief under the DV Act alleging economic abuse. Her husband, a government employee, had stopped providing any financial support after she refused to transfer her inherited property to his name. She and her three children were left without means of sustenance while the husband continued to live in a separate residence.",
    legalReasoning:
      "The Court observed that economic abuse as defined under Section 3(iv) of the DV Act includes deprivation of financial resources. The husband's refusal to provide maintenance despite having adequate income from government service constituted economic abuse. The Court noted that the right to maintenance is a fundamental right linked to Article 21 of the Constitution.",
    decision:
      "Petition allowed; husband directed to pay interim maintenance of Rs. 15,000 per month under Section 20 of the DV Act and monetary relief for past deprivation.",
    relevantSections: [
      "Section 3(iv), DV Act 2005",
      "Section 20, DV Act 2005",
      "Section 22, DV Act 2005",
      "Section 125, CrPC",
    ],
  },
  {
    caseTitle: "Smt. Kavita Verma v. State of U.P. & Ors.",
    year: 2018,
    caseNumber: "Criminal Misc. Application No. 9012/2018",
    facts:
      "The applicant sought quashing of the FIR registered against her husband under Section 498A IPC, stating that the complaints were made in a moment of anger and the parties had since reconciled. The couple submitted a joint affidavit stating they were living together peacefully and wished to continue their marriage.",
    legalReasoning:
      "The Court noted that while Section 498A is a non-compoundable offence, the Supreme Court in B.S. Joshi v. State of Haryana had held that High Courts can exercise inherent powers under Section 482 CrPC to quash proceedings if a genuine settlement has been reached. The Court examined the bona fides of the settlement and was satisfied that reconciliation was genuine.",
    decision:
      "FIR and consequential proceedings quashed under Section 482 CrPC in the interest of justice and preservation of the matrimonial home.",
    relevantSections: [
      "Section 498A, IPC",
      "Section 482, CrPC",
      "Section 3, DV Act 2005",
    ],
  },
  {
    caseTitle: "Smt. Meera Gupta v. Suresh Gupta & Ors.",
    year: 2021,
    caseNumber: "First Appeal No. 3456/2021",
    facts:
      "The appellant challenged the Magistrate's order denying her a residence order under Section 19 of the DV Act. She alleged that her husband and in-laws had locked her out of the shared household. The respondents claimed the property belonged solely to the mother-in-law and the appellant had no right to reside there. The appellant presented her marriage photographs showing the home as her matrimonial residence.",
    legalReasoning:
      "The Court interpreted 'shared household' under Section 2(s) of the DV Act broadly, holding that a household where the aggrieved person has lived in a domestic relationship is a shared household regardless of ownership. The mother-in-law's sole ownership of the property did not extinguish the appellant's right to residence under the DV Act as clarified by the Supreme Court in S.R. Batra v. Taruna Batra.",
    decision:
      "Appeal allowed; Magistrate's order set aside and residence order granted directing the respondents to restore the appellant's access to the shared household.",
    relevantSections: [
      "Section 2(s), DV Act 2005",
      "Section 17, DV Act 2005",
      "Section 19, DV Act 2005",
    ],
  },
  {
    caseTitle: "Mohd. Irfan v. Smt. Nasreen & Anr.",
    year: 2020,
    caseNumber: "Criminal Revision No. 7890/2020",
    facts:
      "The revisionist husband challenged the protection order passed under Section 18 of the DV Act, contending that the allegations of domestic violence were fabricated and motivated by property disputes. The wife had alleged verbal abuse, threats, and being forced to wear a veil against her will. Neighbors testified to hearing frequent arguments and seeing the wife in distress.",
    legalReasoning:
      "The Court held that verbal and emotional abuse clearly fall within the definition of domestic violence under Section 3(a) and 3(b) of the DV Act. The testimony of neighbors constituted corroborative evidence. The Court emphasized that the standard of proof in DV Act proceedings is preponderance of probability, not beyond reasonable doubt, as these are civil proceedings in nature despite being filed under a quasi-criminal statute.",
    decision:
      "Revision dismissed; protection order under Section 18 upheld with a direction to the husband to maintain distance and not communicate threats.",
    relevantSections: [
      "Section 3(a), DV Act 2005",
      "Section 3(b), DV Act 2005",
      "Section 18, DV Act 2005",
      "Section 506, IPC",
    ],
  },
  {
    caseTitle: "Smt. Sunita Yadav v. Vikram Yadav",
    year: 2022,
    caseNumber: "Criminal Appeal No. 2345/2022",
    facts:
      "The appellant wife sought custody of her minor daughter under the DV Act proceedings. The husband had forcibly taken the child after the appellant left the matrimonial home due to violence. The appellant presented evidence of the husband's alcoholism and violent behavior, including police complaints and medical certificates.",
    legalReasoning:
      "The Court considered the welfare of the child as the paramount consideration. Under Section 21 of the DV Act, the Magistrate has the power to grant temporary custody. The evidence of alcoholism and violence established that the child's welfare would be better served in the mother's custody. The Court applied the principles laid down in Gaurav Nagpal v. Sumedha Nagpal regarding the best interest of the child.",
    decision:
      "Appeal allowed; temporary custody of the minor child granted to the mother with visitation rights to the father, subject to supervision.",
    relevantSections: [
      "Section 21, DV Act 2005",
      "Section 12, DV Act 2005",
      "Section 18, DV Act 2005",
    ],
  },
  {
    caseTitle: "Smt. Geeta Mishra v. Ramesh Mishra & Ors.",
    year: 2017,
    caseNumber: "Criminal Misc. Writ Petition No. 4567/2017",
    facts:
      "The petitioner alleged that her husband and his family members had subjected her to dowry-related harassment and physical violence for over five years. She was hospitalized twice for burn injuries, which the respondents claimed were accidental. She filed complaints under both Section 498A IPC and the DV Act. The investigation revealed inconsistencies in the respondents' version of events.",
    legalReasoning:
      "The Court held that the simultaneous filing of complaints under Section 498A IPC and the DV Act is permissible as the remedies are complementary and not mutually exclusive. The medical evidence of burn injuries coupled with the inconsistent statements of the respondents created a strong presumption of domestic violence. The Court emphasized the duty of the court to look at the totality of circumstances in such cases.",
    decision:
      "Writ petition allowed; protection order, compensation order, and a direction for expeditious trial of the criminal case issued.",
    relevantSections: [
      "Section 498A, IPC",
      "Section 304B, IPC",
      "Section 3, DV Act 2005",
      "Section 18, DV Act 2005",
      "Section 22, DV Act 2005",
    ],
  },
  {
    caseTitle: "Smt. Anita Singh v. Dr. Rakesh Singh",
    year: 2021,
    caseNumber: "Writ Petition No. 8901/2021",
    facts:
      "The petitioner, a working woman employed as a bank officer, alleged emotional and psychological abuse by her husband, a doctor. He had consistently belittled her career, prevented her from attending office functions, monitored her phone calls, and isolated her from her family. No physical violence was alleged. She sought protection and residence orders under the DV Act.",
    legalReasoning:
      "The Court noted that domestic violence under Section 3 of the DV Act expressly includes emotional abuse such as insults, ridicule, humiliation, and isolation. Physical violence is not a prerequisite for invoking the protections of the Act. The Court relied on the legislative intent behind the DV Act which seeks to provide a broader definition of domestic violence to protect women from all forms of abuse in the domestic sphere.",
    decision:
      "Petition allowed; protection order granted restraining the husband from emotional abuse and isolating behavior; counseling directed for both parties.",
    relevantSections: [
      "Section 3(a), DV Act 2005",
      "Section 3(b), DV Act 2005",
      "Section 12, DV Act 2005",
      "Section 18, DV Act 2005",
    ],
  },
  {
    caseTitle: "Smt. Fatima Begum v. Mohd. Zaheer & Ors.",
    year: 2019,
    caseNumber: "Criminal Appeal No. 6789/2019",
    facts:
      "The appellant wife was given triple talaq by her husband through a written notice. Following the divorce, she was denied access to the matrimonial home and all her belongings including gold jewelry given as mahr. She filed an application under the DV Act seeking monetary relief and return of her stridhan. The husband contended that Muslim personal law governed the matter and the DV Act was not applicable.",
    legalReasoning:
      "The Court held that the DV Act is a secular legislation that applies to all women irrespective of their religion. The right to reside in a shared household under the DV Act cannot be defeated by personal law remedies. The Court also noted that the Supreme Court in Shayara Bano had declared triple talaq unconstitutional, further strengthening the appellant's case for relief under the DV Act.",
    decision:
      "Appeal allowed; respondent directed to return stridhan and pay monetary relief under Section 20 of the DV Act; residence order granted until alternative accommodation is arranged.",
    relevantSections: [
      "Section 12, DV Act 2005",
      "Section 19, DV Act 2005",
      "Section 20, DV Act 2005",
      "Section 22, DV Act 2005",
    ],
  },
  {
    caseTitle: "Smt. Pooja Tiwari v. Amit Tiwari",
    year: 2023,
    caseNumber: "Criminal Misc. Application No. 1122/2023",
    facts:
      "The applicant, a married woman, alleged that her husband had been engaged in an extramarital affair and when confronted, he became violent, broke household items, and threatened to kill her. She filed a complaint under the DV Act after her husband attempted to forcefully evict her from the house. She also alleged that her husband's paramour had visited the matrimonial home and verbally abused her.",
    legalReasoning:
      "The Court observed that threatening behavior and destruction of property fall within the ambit of domestic violence under Section 3 of the DV Act. The respondent's conduct of bringing a third party into the matrimonial home to harass the wife constitutes emotional abuse. The Court emphasized that a wife's right to reside in the shared household cannot be curtailed by her husband's extramarital conduct.",
    decision:
      "Application allowed; ex-parte protection order and residence order granted in favor of the applicant; respondent directed not to alienate the shared property.",
    relevantSections: [
      "Section 3, DV Act 2005",
      "Section 18, DV Act 2005",
      "Section 19, DV Act 2005",
      "Section 506, IPC",
    ],
  },
  {
    caseTitle: "Smt. Rekha Devi v. State of U.P. & Ors.",
    year: 2020,
    caseNumber: "Habeas Corpus Writ Petition No. 3344/2020",
    facts:
      "The petitioner mother filed a habeas corpus petition alleging that her minor son aged 8 years was being illegally detained by her estranged husband and his parents. She stated that the husband had taken the child during a visit and refused to return him. She had previously obtained a protection order under the DV Act which the husband had violated. The child had also missed school for two months.",
    legalReasoning:
      "The Court treated the habeas corpus petition in conjunction with the DV Act proceedings. It held that violation of a protection order is a cognizable and non-bailable offence under Section 31 of the DV Act. The police's failure to act on the complaints of violation was criticized. The Court held that the protection order mechanism is the backbone of the DV Act and its enforcement must be taken seriously.",
    decision:
      "Writ petition allowed; police directed to register FIR under Section 31 of the DV Act for violation of protection order; child directed to be produced before the Court.",
    relevantSections: [
      "Section 18, DV Act 2005",
      "Section 31, DV Act 2005",
      "Section 21, DV Act 2005",
    ],
  },
  {
    caseTitle: "Smt. Asha Devi v. Manoj Kumar & Ors.",
    year: 2018,
    caseNumber: "Criminal Misc. Application No. 2233/2018",
    facts:
      "The applicant mother-in-law sought quashing of the DV Act complaint filed against her by her daughter-in-law. She contended that she was an elderly woman of 72 years living separately and had no role in any alleged domestic violence. The daughter-in-law had made omnibus allegations against all family members including distant relatives without specific allegations against the applicant.",
    legalReasoning:
      "The Court held that while the DV Act covers acts by relatives of the husband, the complainant must make specific allegations against each respondent. Omnibus and vague allegations without any specific role attributed to a particular respondent cannot sustain proceedings. The Court cited Preeti Gupta v. State of Jharkhand regarding the misuse of matrimonial laws through sweeping allegations against elderly family members.",
    decision:
      "Application allowed; proceedings against the elderly mother-in-law quashed, but complaint against husband and other specifically accused respondents to continue.",
    relevantSections: [
      "Section 2(q), DV Act 2005",
      "Section 3, DV Act 2005",
      "Section 482, CrPC",
    ],
  },
  {
    caseTitle: "Smt. Deepa Rawat v. Sanjay Rawat",
    year: 2022,
    caseNumber: "First Appeal No. 5566/2022",
    facts:
      "The appellant challenged the trial court's dismissal of her DV Act application on the ground of limitation. She had filed the application three years after leaving the matrimonial home. The trial court held that the application was barred by limitation under Section 468 CrPC. The appellant contended that the DV Act does not prescribe a limitation period for filing applications.",
    legalReasoning:
      "The Court held that the DV Act does not prescribe any limitation period for filing applications under Section 12. The provisions of Section 468 CrPC relating to limitation do not apply to DV Act proceedings as they are civil in nature. The Court further observed that domestic violence is often a continuing offence and the cause of action subsists as long as the aggrieved person continues to suffer the effects of the violence.",
    decision:
      "Appeal allowed; trial court's order of dismissal set aside; matter remanded for hearing on merits.",
    relevantSections: [
      "Section 12, DV Act 2005",
      "Section 28, DV Act 2005",
      "Section 468, CrPC",
    ],
  },
  {
    caseTitle: "Smt. Lakshmi Pandey v. Vivek Pandey & Ors.",
    year: 2021,
    caseNumber: "Criminal Revision No. 7788/2021",
    facts:
      "The revisionist wife challenged the inadequate maintenance amount of Rs. 3,000 per month granted by the Magistrate under the DV Act. She presented evidence that her husband earned over Rs. 1.5 lakhs per month as a software engineer while she was unemployed and caring for two young children. She also sought compensation for medical expenses arising from injuries sustained during domestic violence incidents.",
    legalReasoning:
      "The Court held that the quantum of maintenance must be determined considering the financial capacity of the respondent, the standard of living of the aggrieved person, and the needs of the children. An amount of Rs. 3,000 was grossly inadequate given the respondent's monthly income of Rs. 1.5 lakhs. The Court also directed compensation under Section 22 of the DV Act for the medical expenses incurred due to violence.",
    decision:
      "Revision allowed; maintenance enhanced to Rs. 35,000 per month (Rs. 20,000 for wife and Rs. 7,500 per child); additional compensation of Rs. 2 lakhs directed for medical expenses.",
    relevantSections: [
      "Section 20, DV Act 2005",
      "Section 22, DV Act 2005",
      "Section 12, DV Act 2005",
      "Section 125, CrPC",
    ],
  },
  {
    caseTitle: "Smt. Savitri Kumari v. State of U.P. & Anr.",
    year: 2023,
    caseNumber: "Writ Petition No. 9900/2023",
    facts:
      "The petitioner, a live-in partner, sought protection under the DV Act alleging physical and emotional abuse by her partner of seven years. They had been living together and had a child. The respondent argued that the DV Act only applies to legally married wives and not to live-in partners. He denied any domestic relationship as defined under the Act.",
    legalReasoning:
      "The Court held that the DV Act's definition of 'domestic relationship' under Section 2(f) includes relationships 'in the nature of marriage.' A live-in relationship of seven years with a child born from the relationship clearly constitutes a relationship in the nature of marriage. The Court relied on the Supreme Court's decision in D. Velusamy v. D. Patchaiammal which laid down criteria for identifying such relationships.",
    decision:
      "Writ petition allowed; live-in partner recognized as an aggrieved person under the DV Act; protection order and maintenance order granted.",
    relevantSections: [
      "Section 2(a), DV Act 2005",
      "Section 2(f), DV Act 2005",
      "Section 3, DV Act 2005",
      "Section 18, DV Act 2005",
      "Section 20, DV Act 2005",
    ],
  },
];

module.exports = sampleCases;
