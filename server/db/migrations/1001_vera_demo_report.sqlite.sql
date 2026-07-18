-- Vera presents report analysis in English while retaining French source titles as original material.
UPDATE reports
SET title = 'Air conditioning, heatwaves, and climate adaptation', language = 'en', rhetoric_disclaimer = 'This analysis examines how the statement is presented, not the overall truth of the claim or its author’s intent.'
WHERE id = 'a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df';

UPDATE report_claims
SET quote = '“I am horrified by people telling me that we should just install air conditioning everywhere (…) Do you think that will prevent a forest fire or animals from dying? That is not adaptation, it is an emergency measure.”', role = 'Minister for Ecological Transition', claim_date = '26 June 2026'
WHERE report_id = 'a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df';

UPDATE report_claim_items SET text = 'Monique Barbut was Minister for Ecological Transition in June 2026.' WHERE id = 'claim-v1';
UPDATE report_claim_items SET text = 'She made these remarks on BFMTV on 26 June 2026.' WHERE id = 'claim-v2';
UPDATE report_claim_items SET text = 'Air conditioning does not prevent forest fires or wild-animal deaths.' WHERE id = 'claim-v3';
UPDATE report_claim_items SET text = 'Air conditioning is an emergency measure, not a climate-adaptation solution.' WHERE id = 'claim-v4';
UPDATE report_claim_items SET text = 'Her indignation at the idea of widely installing air conditioning.' WHERE id = 'claim-i1';

UPDATE report_conclusions
SET label = 'Partly supported, but incomplete or misleading by omission', summary = 'Monique Barbut made these remarks, and her ministerial position is confirmed. However, saying that air conditioning prevents nothing is reductive: studies indicate that it can significantly reduce heat-related mortality, particularly in Paris, where risk is among Europe’s highest. It has no direct effect on forest fires or wild-animal deaths. Her argument is therefore partly true, but omits important context.'
WHERE report_id = 'a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df';

UPDATE report_sources SET note = 'Secondary source based on epidemiological studies.' WHERE id = 'src-science';

UPDATE report_confidence_items SET title = 'Authenticity of the statement', detail = 'The statement is reported by BFMTV and RTL.' WHERE id = 'conf-h1';
UPDATE report_confidence_items SET title = 'Ministerial position', detail = 'Monique Barbut’s position is confirmed by official sources.' WHERE id = 'conf-h2';
UPDATE report_confidence_items SET title = 'Effect on human mortality', detail = 'Available material relies on studies reported by secondary sources.' WHERE id = 'conf-m1';
UPDATE report_confidence_items SET title = 'No effect on forest fires', detail = 'A scientific consensus is mentioned, but this investigation does not cite a direct source.' WHERE id = 'conf-m2';
UPDATE report_confidence_items SET title = 'A single proposed solution is not established', detail = 'No source confirms that air conditioning was presented as a single solution to forest fires.' WHERE id = 'conf-l1';

UPDATE report_evidence_items SET title = 'Official position confirmed', detail = 'Monique Barbut has been Minister for Ecological Transition since October 2025.' WHERE id = 'ev-s1';
UPDATE report_evidence_items SET title = 'Statement authenticated', detail = 'She made these remarks on BFMTV on 26 June 2026.' WHERE id = 'ev-s2';
UPDATE report_evidence_items SET title = 'No direct effect on fires', detail = 'Air conditioning has no direct effect on forest fires, according to the consensus implied in climate studies and reporting.' WHERE id = 'ev-s3';
UPDATE report_evidence_items SET title = 'Reduced human mortality', detail = 'Paris, with relatively low air-conditioning coverage, has Europe’s highest heat-related excess-mortality rate. In the United States, widespread use is estimated to have reduced heat-related mortality by 80%.' WHERE id = 'ev-c1';
UPDATE report_evidence_items SET title = 'A potentially artificial opposition', detail = 'No source suggests that air conditioning is a solution to forest fires. The argument creates a false opposition.' WHERE id = 'ev-c2';
UPDATE report_evidence_items SET title = 'Emergency and adaptation', detail = 'The IPCC notes that air conditioning can be necessary to protect vulnerable people, but should be used sparingly.' WHERE id = 'ev-c3';
UPDATE report_evidence_items SET title = 'Exact context of the statement', detail = 'The X post does not establish whether Barbut was responding to a specific proposal or generalising a broader debate.' WHERE id = 'ev-u1';
UPDATE report_evidence_items SET title = 'Effect on animal deaths', detail = 'No cited study directly addresses this point. Farmed or captive animals may be affected, but this report does not document it.' WHERE id = 'ev-u2';

UPDATE report_timeline_items SET title = 'Statement on BFMTV', detail = 'Monique Barbut made these remarks on BFMTV.' WHERE id = 'time-1';
UPDATE report_timeline_items SET title = 'Published on X', detail = 'BFMTV’s post is published and reaches 2.6 million views.' WHERE id = 'time-2';
UPDATE report_timeline_items SET title = 'Community Notes added', detail = 'Notes add context about human mortality.' WHERE id = 'time-3';
UPDATE report_timeline_items SET title = 'Media controversy', detail = 'Media outlets relay the controversy, followed by political reactions.' WHERE id = 'time-4';
UPDATE report_timeline_items SET title = 'Origin of “install air conditioning everywhere”', detail = 'The original source of this suggestion remains unknown.' WHERE id = 'time-g1';
UPDATE report_timeline_items SET title = 'Full transcript', detail = 'A complete interview transcript is needed to verify the exact context.' WHERE id = 'time-g2';

UPDATE report_context_items SET title = 'Scope of climate adaptation', detail = 'Air conditioning is one option among many, including urban greening, cooling spaces, and insulation. Emergency protection and adaptation can be complementary.' WHERE id = 'ctx-1';
UPDATE report_context_items SET title = 'Mortality data', detail = 'The June 2026 heatwave may have caused 1,500 to 2,600 deaths in France. Older and lower-income people may have been most affected.' WHERE id = 'ctx-2';
UPDATE report_context_items SET title = 'Political debate', detail = 'Opposition parties and local representatives support air conditioning in hospitals and schools.' WHERE id = 'ctx-3';

UPDATE report_rhetoric_items SET title = 'Emotional framing', detail = '“I am horrified” uses charged language that can polarise the debate.' WHERE id = 'rhet-1';
UPDATE report_rhetoric_items SET title = 'Rhetorical question', detail = '“Do you think that will prevent…?” implies a negative answer without qualification.' WHERE id = 'rhet-2';
UPDATE report_rhetoric_items SET title = 'False dichotomy', detail = 'Opposing air conditioning and adaptation is reductive: both can coexist.' WHERE id = 'rhet-3';
UPDATE report_rhetoric_items SET title = 'Omitted context', detail = 'The statement does not mention potential benefits for human mortality or inequalities in access.' WHERE id = 'rhet-4';
UPDATE report_rhetoric_items SET title = 'Stated certainty', detail = '“That is not adaptation” is presented as fact, although experts qualify this point.' WHERE id = 'rhet-5';

UPDATE report_change_factors SET title = 'A full interview transcript', detail = 'It would make it possible to verify the exact context.' WHERE id = 'change-1';
UPDATE report_change_factors SET title = 'A study of animal deaths', detail = 'No available material directly addresses this point.' WHERE id = 'change-2';
UPDATE report_change_factors SET title = 'An official clarification', detail = 'It would clarify the ministry’s position.' WHERE id = 'change-3';
UPDATE report_change_factors SET title = 'Updated heatwave data', detail = 'It would refine the excess-mortality estimate.' WHERE id = 'change-4';

UPDATE report_follow_ups
SET suggestion = 'Monitor public statements from Monique Barbut or the Ministry for Ecological Transition about air conditioning through the end of July 2026, particularly if another heatwave or controversy emerges.', frequency = 'Daily during a heatwave, otherwise weekly.'
WHERE report_id = 'a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df';
