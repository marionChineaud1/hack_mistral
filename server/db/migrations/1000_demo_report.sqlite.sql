INSERT OR IGNORE INTO reports (id,title,language,is_demo,published_at,rhetoric_disclaimer) VALUES
('a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Climatisation, canicule et adaptation climatique','fr',1,'2026-06-26','Cette analyse porte sur la présentation du contenu, non sur la véracité globale de l’affirmation ni sur l’intention de son auteur.');
INSERT OR IGNORE INTO report_claims VALUES
('claim-main','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','« Je suis horrifiée par les gens qui me disent qu''il n''y a qu''à mettre la clim'' partout (…) Vous croyez que ça va éviter un feu de forêt, la mort des animaux ? Ça n''est pas de l''adaptation, c''est une mesure d''urgence. »','Monique Barbut','Ministre de la Transition écologique','BFMTV','26 juin 2026');
INSERT OR IGNORE INTO report_claim_items VALUES
('claim-v1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','verifiable','Monique Barbut est bien ministre de la Transition écologique en juin 2026.',1),
('claim-v2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','verifiable','Elle a tenu ces propos sur BFMTV le 26 juin 2026.',2),
('claim-v3','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','verifiable','La climatisation ne prévient ni les feux de forêt ni la mort des animaux.',3),
('claim-v4','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','verifiable','La climatisation est une mesure d’urgence, pas une solution d’adaptation climatique.',4),
('claim-i1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','interpretation','Son indignation face à la suggestion de généraliser la climatisation.',1);
INSERT OR IGNORE INTO report_conclusions VALUES
('conclusion-main','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Affirmation partiellement étayée, mais incomplète ou trompeuse par omission','Monique Barbut a bien tenu ces propos, et son statut de ministre est confirmé. Cependant, son affirmation selon laquelle la climatisation ne prévient rien est réductrice : des études montrent qu’elle réduit significativement la mortalité humaine lors des canicules, notamment à Paris, où le risque est le plus élevé en Europe. En revanche, elle n’a aucun impact direct sur les feux de forêt ou la mort des animaux sauvages, ce qui rend son argument partiellement vrai mais trompeur par omission de contexte.');
INSERT OR IGNORE INTO report_sources (id,report_id,kind,title,publisher,url,note,sort_order) VALUES
('src-bfmtv','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','primary','Déclaration de Monique Barbut sur BFMTV','BFMTV','https://www.bfmtv.com/politique/video-je-suis-horrifiee-par-les-gens-qui-me-disent-qu-il-n-y-a-qu-a-mettre-la-clim-partout-vous-croyez-que-ca-va-eviter-un-feu-de-foret-la-mort-des-animaux-lance-la-ministre-monique-barbut_VN-202606260322.html',NULL,1),
('src-gouv','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','primary','Statut officiel de Monique Barbut','info.gouv.fr','https://www.info.gouv.fr/personnalite/monique-barbut',NULL,2),
('src-elysee','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','primary','Composition du gouvernement','Élysée','https://www.elysee.fr/emmanuel-macron/2026/02/26/nomination-du-gouvernement-7',NULL,3),
('src-x','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','primary','Post de @BFMTV','X','https://x.com/BFMTV/status/2070421512050364493',NULL,4),
('src-rtl','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Réaction à la déclaration','RTL','https://www.rtl.fr/actu/politique/vous-croyez-que-ca-va-eviter-quoi-interrogee-sur-la-climatisation-et-la-canicule-la-ministre-de-la-transition-ecologique-se-dit-horrifiee-7900650053',NULL,1),
('src-science','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Impact de la climatisation sur la mortalité','SciencePost','https://sciencepost.fr/refuser-la-climatisation-au-nom-de-l-ecologie-tue-plus-de-gens-que-la-canicule-elle-meme/','Source secondaire basée sur des études épidémiologiques.',2),
('src-owid','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Données sur la mortalité et la chaleur','Our World in Data','https://ourworldindata.org/part-one-how-m',NULL,3),
('src-21news','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Analyse de la polémique','21 News','https://www.21news.be/je-suis-horrifiee-par-les-gens-qui-me-disent-quil-ny-a-qua-mettre-la-clim-partout-la-sortie-de-monique-barbut-qui-fait-polemique/',NULL,4),
('src-franceinfo','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Position du GIEC sur la climatisation','France Info','https://www.franceinfo.fr/environnement/crise-climatique/que-dit-le-giec-sur-les-effets-potentiels-de-la-climatisation-outil-tres-discute-contre-les-fortes-chaleurs-dans-un-contexte-de-rechauffement-climatique_8093621.html',NULL,5),
('src-aoc','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Pour un modèle d’adaptation collectif','AOC Media','https://aoc.media/analyse/2026/07/12/pour-un-modele-dadaptation-collectif-face-aux-canicules/',NULL,6),
('src-meteo','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Canicule en France : estimations de décès','Météo Contact','https://www.meteocontact.fr/actualite-meteo/01/07/2026/canicule-en-france-jusqua-1-500-deces-estimes-selon-ces-modelisations/',NULL,7),
('src-senior','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Canicule et populations vulnérables','Bonjour Senior','https://www.bonjoursenior.fr/actualites/canicule-de-juin-2026-pourquoi-la-surmortalite-continue-de-saggraver',NULL,8),
('src-orange','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','secondary','Réactions politiques','Orange Actu','https://actu.orange.fr/politique/canicule-les-politiques-vent-debout-apres-les-propos-de-la-ministre-de-la-transition-ecologique-sur-la-climatisation-magic-CNT000002qc5lP.html',NULL,9);
INSERT OR IGNORE INTO report_confidence_items VALUES
('conf-h1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','high','Authenticité de la déclaration','La déclaration est rapportée par BFMTV et RTL.',1),
('conf-h2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','high','Statut de ministre','Le statut de Monique Barbut est confirmé par des sources officielles.',2),
('conf-m1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','moderate','Impact sur la mortalité humaine','Les éléments disponibles reposent sur des études reprises par des sources secondaires.',1),
('conf-m2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','moderate','Absence d’effet sur les feux de forêt','Consensus scientifique évoqué, mais non sourcé directement dans cette enquête.',2),
('conf-l1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','limitation','Proposition de solution unique non établie','Aucune source ne confirme que la climatisation était présentée comme une solution unique aux feux de forêt.',1);
INSERT OR IGNORE INTO report_evidence_items VALUES
('ev-s1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','support','Statut officiel confirmé','Monique Barbut est ministre de la Transition écologique depuis octobre 2025.',1),
('ev-s2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','support','Déclaration authentifiée','Elle a bien tenu ces propos le 26 juin 2026 sur BFMTV.',2),
('ev-s3','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','support','Pas d’effet direct sur les incendies','La climatisation n’a pas d’effet direct sur les feux de forêt, selon le consensus implicite dans les médias et études climatiques.',3),
('ev-c1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','contradict','Réduction de la mortalité humaine','Paris, mal équipée, a le taux de surmortalité caniculaire le plus élevé d’Europe. Aux États-Unis, l’équipement massif aurait fait chuter la mortalité liée à la chaleur de 80 %.',1),
('ev-c2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','contradict','Une opposition possiblement artificielle','Aucune source ne suggère que la climatisation soit une solution aux feux de forêt : l’argument crée une fausse opposition.',2),
('ev-c3','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','contradict','Urgence et adaptation','Le GIEC souligne que la climatisation peut être nécessaire pour protéger les populations vulnérables, mais doit être utilisée avec parcimonie.',3),
('ev-u1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','unverified','Contexte exact de la déclaration','Le post X ne précise pas si Barbut répondait à une proposition spécifique ou si elle généralisait un débat.',1),
('ev-u2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','unverified','Impact sur la mort des animaux','Aucune étude citée ne traite spécifiquement de ce point. Les animaux d’élevage ou en captivité pourraient être concernés, mais cela n’est pas documenté ici.',2);
INSERT OR IGNORE INTO report_timeline_items VALUES
('time-1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','event','2026-06-26','Déclaration sur BFMTV','Monique Barbut tient ces propos sur BFMTV.',1),
('time-2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','event','2026-06-26','Publication sur X','Le post de @BFMTV est publié et atteint 2,6 millions de vues.',2),
('time-3','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','event','2026-06-26','Ajout de Community Notes','Des notes ajoutent du contexte sur la mortalité humaine.',3),
('time-4','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','event','2026-06-26','Polémique médiatique','Des médias relaient la polémique, suivis de réactions politiques.',4),
('time-g1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','gap',NULL,'Origine de « mettre la clim’ partout »','La source initiale de cette suggestion reste inconnue.',5),
('time-g2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','gap',NULL,'Transcription complète','Une transcription intégrale de l’interview manque pour vérifier le contexte exact.',6);
INSERT OR IGNORE INTO report_context_items VALUES
('ctx-1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Portée de l’adaptation climatique','La climatisation est une solution parmi d’autres : végétalisation, îlots de fraîcheur et isolation. Urgence et adaptation peuvent être complémentaires.',1),
('ctx-2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Données sur la mortalité','La canicule de juin 2026 aurait causé 1 500 à 2 600 décès en France. Les personnes âgées et précaires seraient les plus touchées.',2),
('ctx-3','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Débat politique','L’opposition et des élus locaux défendent la climatisation dans les hôpitaux et les écoles.',3);
INSERT OR IGNORE INTO report_rhetoric_items VALUES
('rhet-1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Formulation émotionnelle','« Je suis horrifiée » emploie un langage chargé qui peut polariser le débat.',1),
('rhet-2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Question rhétorique','« Vous croyez que ça va éviter… ? » sous-entend une réponse négative sans nuance.',2),
('rhet-3','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Fausse dichotomie','Opposer climatisation et adaptation est réducteur : les deux peuvent coexister.',3),
('rhet-4','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Omission de contexte','La déclaration ne mentionne pas les bénéfices sur la mortalité humaine ni les inégalités d’accès.',4),
('rhet-5','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Certitude affichée','« Ça n’est pas de l’adaptation » est présenté comme un fait alors que des experts nuancent ce point.',5);
INSERT OR IGNORE INTO report_change_factors VALUES
('change-1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Une transcription complète de l’interview','Elle permettrait de vérifier le contexte exact.',1),
('change-2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Une étude sur la mort des animaux','Aucun élément disponible ne traite directement ce point.',2),
('change-3','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Une clarification officielle','Elle éclairerait la position du ministère.',3),
('change-4','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Des données actualisées sur la canicule','Elles affineraient l’estimation de la surmortalité.',4);
INSERT OR IGNORE INTO report_follow_ups VALUES
('follow-1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','Surveiller les déclarations officielles de Monique Barbut ou du ministère de la Transition écologique sur la climatisation d’ici fin juillet 2026, en cas de nouvelle vague de chaleur ou de polémique.','Quotidienne en cas de canicule, sinon hebdomadaire.');
INSERT OR IGNORE INTO report_citations VALUES
('cit-1','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-bfmtv','confidence','conf-h1',1),
('cit-2','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-rtl','confidence','conf-h1',2),
('cit-3','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-gouv','confidence','conf-h2',1),
('cit-4','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-elysee','confidence','conf-h2',2),
('cit-5','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-science','confidence','conf-m1',1),
('cit-6','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-21news','confidence','conf-l1',1),
('cit-7','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-gouv','evidence','ev-s1',1),
('cit-8','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-bfmtv','evidence','ev-s2',1),
('cit-9','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-science','evidence','ev-c1',1),
('cit-10','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-21news','evidence','ev-c2',1),
('cit-11','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-franceinfo','evidence','ev-c3',1),
('cit-12','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-x','timeline','time-2',1),
('cit-13','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-aoc','context','ctx-1',1),
('cit-14','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-meteo','context','ctx-2',1),
('cit-15','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-senior','context','ctx-2',2),
('cit-16','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-orange','context','ctx-3',1),
('cit-17','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-21news','rhetoric','rhet-3',1),
('cit-18','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-science','rhetoric','rhet-4',1),
('cit-19','a3d2f92c-feb4-4c8f-9c1e-2f26ad14c7df','src-franceinfo','rhetoric','rhet-5',1);
