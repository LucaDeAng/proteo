export type Lang = 'it' | 'en'
export type Era = 'void' | 'bigbang' | 'stars' | 'ice' | 'cambrian' | 'intelligence' | 'singularity'
export type Category = 'model' | 'paper' | 'event' | 'product' | 'breakthrough'

export interface BiText { it: string; en: string }

export interface Milestone {
  id: string
  name: string
  year: number
  era: Era
  description: BiText
  significance: number
  category: Category
  creator?: string
}

export interface EraQuote { text: BiText; author: string; year: number }
export interface EraStat { value: string; label: BiText }

export interface EraInfo {
  id: Era
  name: BiText
  cosmicName: BiText
  period: string
  tagline: BiText
  description: BiText
  color: string
  glowColor: string
  chapter: number
  quote: EraQuote
  stats: EraStat[]
}

export const eras: EraInfo[] = [
  {
    id: 'void', chapter: 1,
    name: { it: 'Il Vuoto', en: 'The Void' },
    cosmicName: { it: 'Proto-Materia', en: 'Proto-Matter' },
    period: 'Pre-1950',
    tagline: { it: 'I sogni delle macchine pensanti', en: 'Dreams of thinking machines' },
    description: {
      it: "Leibniz, Babbage, Lovelace, Turing — visionari che sognarono macchine pensanti secoli prima che esistessero. Nel vuoto, la materia primordiale si aggrega.",
      en: 'Leibniz, Babbage, Lovelace, Turing — visionaries who dreamed of thinking machines centuries before they existed. In the void, primordial matter coalesces.',
    },
    color: '#4c1d95', glowColor: '#7c3aed',
    quote: { text: { it: 'La questione se le macchine possano pensare... e\u0027 rilevante quanto chiedersi se i sottomarini possano nuotare.', en: 'The question of whether machines can think... is about as relevant as the question of whether submarines can swim.' }, author: 'Edsger Dijkstra', year: 1984 },
    stats: [
      { value: '~300', label: { it: 'anni di sogni meccanici', en: 'years of mechanical dreams' } },
      { value: '1843', label: { it: 'primo algoritmo (Lovelace)', en: 'first algorithm (Lovelace)' } },
    ],
  },
  {
    id: 'bigbang', chapter: 2,
    name: { it: 'Il Big Bang', en: 'The Big Bang' },
    cosmicName: { it: 'La Nascita', en: 'The Birth' },
    period: '1950 — 1956',
    tagline: { it: "L'intelligenza artificiale nasce", en: 'Artificial intelligence is born' },
    description: {
      it: 'Alan Turing pubblica "Computing Machinery and Intelligence" e chiede: le macchine possono pensare? Nel 1956, alla Dartmouth Conference, nasce ufficialmente l\'AI.',
      en: 'Alan Turing publishes "Computing Machinery and Intelligence" and asks: can machines think? In 1956, at the Dartmouth Conference, AI is officially born.',
    },
    color: '#f59e0b', glowColor: '#fbbf24',
    quote: { text: { it: 'Proponiamo che uno studio di 2 mesi e 10 uomini sull\'intelligenza artificiale venga condotto.', en: 'We propose that a 2-month, 10-man study of artificial intelligence be carried out.' }, author: 'Dartmouth Proposal', year: 1956 },
    stats: [
      { value: '10', label: { it: 'ricercatori a Dartmouth', en: 'researchers at Dartmouth' } },
      { value: '1950', label: { it: 'anno del Test di Turing', en: 'year of the Turing Test' } },
    ],
  },
  {
    id: 'stars', chapter: 3,
    name: { it: 'Le Prime Stelle', en: 'The First Stars' },
    cosmicName: { it: "L'Eta\u0300 dell'Oro", en: 'The Golden Age' },
    period: '1956 — 1974',
    tagline: { it: 'I primi programmi che "pensano"', en: 'The first programs that "think"' },
    description: {
      it: "ELIZA parla, il Perceptron impara. I primi programmi AI si accendono come stelle nell'universo giovane. L'ottimismo e' alle stelle.",
      en: 'ELIZA talks, the Perceptron learns. The first AI programs ignite like stars in the young universe. Optimism is sky-high.',
    },
    color: '#ea580c', glowColor: '#f97316',
    quote: { text: { it: "ELIZA riusciva a produrre un'illusione di comprensione... fui sorpreso nel vedere quanto rapidamente le persone si coinvolgessero emotivamente.", en: 'ELIZA was able to produce an illusion of understanding... I was startled to see how quickly people became emotionally involved.' }, author: 'Joseph Weizenbaum', year: 1976 },
    stats: [
      { value: '$2M', label: { it: 'picco fondi AI annuali USA', en: 'peak annual US AI funding' } },
      { value: '1966', label: { it: 'ELIZA, il primo chatbot', en: 'ELIZA, the first chatbot' } },
    ],
  },
  {
    id: 'ice', chapter: 4,
    name: { it: 'Le Ere Glaciali', en: 'The Ice Ages' },
    cosmicName: { it: "L'Inverno Cosmico", en: 'The Cosmic Winter' },
    period: '1974 — 1993',
    tagline: { it: 'Le promesse infrante', en: 'Broken promises' },
    description: {
      it: "Il Lighthill Report gela i finanziamenti. Le reti neurali cadono in disgrazia. Due inverni dell'AI congelano il progresso. Ma sotto il ghiaccio, la vita persiste.",
      en: 'The Lighthill Report freezes funding. Neural networks fall from grace. Two AI winters freeze progress. But beneath the ice, life persists.',
    },
    color: '#0ea5e9', glowColor: '#38bdf8',
    quote: { text: { it: "Nel campo dell'AI, non c'e\u0027 nulla di piu\u0300 permanente di chi afferma che l'intelligenza e\u0027 dietro l'angolo.", en: "In the field of AI, there is nothing more permanent than someone who claims intelligence is just around the corner." }, author: 'Drew McDermott', year: 1976 },
    stats: [
      { value: '2', label: { it: 'inverni dell\'AI sopravvissuti', en: 'AI winters survived' } },
      { value: '1986', label: { it: 'backpropagation rinasce', en: 'backpropagation reborn' } },
    ],
  },
  {
    id: 'cambrian', chapter: 5,
    name: { it: "L'Esplosione Cambriana", en: 'The Cambrian Explosion' },
    cosmicName: { it: 'Il Rinascimento', en: 'The Renaissance' },
    period: '1993 — 2012',
    tagline: { it: 'La diversita\u0300 esplode', en: 'Diversity explodes' },
    description: {
      it: 'Internet porta dati. Deep Blue batte Kasparov. Hinton, LeCun, Bengio non si arresero durante l\'inverno — e posano le basi del deep learning.',
      en: 'The Internet brings data. Deep Blue beats Kasparov. Hinton, LeCun, Bengio never gave up during winter — and lay the foundations of deep learning.',
    },
    color: '#10b981', glowColor: '#34d399',
    quote: { text: { it: "Internet sta diventando la piazza del villaggio globale di domani.", en: 'The Internet is becoming the town square for the global village of tomorrow.' }, author: 'Bill Gates', year: 1999 },
    stats: [
      { value: '14M', label: { it: 'immagini in ImageNet', en: 'images in ImageNet' } },
      { value: '1997', label: { it: 'Deep Blue batte Kasparov', en: 'Deep Blue beats Kasparov' } },
    ],
  },
  {
    id: 'intelligence', chapter: 6,
    name: { it: "L'Intelligenza Emerge", en: 'Intelligence Emerges' },
    cosmicName: { it: 'La Vita Complessa', en: 'Complex Life' },
    period: '2012 — 2022',
    tagline: { it: 'Le reti neurali risvegliate', en: 'Neural networks awakened' },
    description: {
      it: "AlexNet vince ImageNet 2012. AlphaGo batte il campione di Go. Il Transformer cambia tutto. GPT-3 emerge con 175 miliardi di parametri.",
      en: 'AlexNet wins ImageNet 2012. AlphaGo beats the Go champion. The Transformer changes everything. GPT-3 emerges with 175 billion parameters.',
    },
    color: '#a855f7', glowColor: '#c084fc',
    quote: { text: { it: 'Attention is all you need.', en: 'Attention is all you need.' }, author: 'Vaswani et al.', year: 2017 },
    stats: [
      { value: '175B', label: { it: 'parametri di GPT-3', en: 'GPT-3 parameters' } },
      { value: '2017', label: { it: 'nasce il Transformer', en: 'the Transformer is born' } },
    ],
  },
  {
    id: 'singularity', chapter: 7,
    name: { it: 'La Singolarita\u0300', en: 'The Singularity' },
    cosmicName: { it: 'La Civilta\u0300', en: 'Civilization' },
    period: '2022 — 2026',
    tagline: { it: "L'intelligenza diventa universale", en: 'Intelligence goes universal' },
    description: {
      it: "ChatGPT: 100 milioni di utenti in 2 mesi. Claude ragiona. Gli agenti collaborano. Il viaggio e' appena iniziato.",
      en: 'ChatGPT: 100 million users in 2 months. Claude reasons. Agents collaborate. The journey has just begun.',
    },
    color: '#eab308', glowColor: '#facc15',
    quote: { text: { it: "Lo sviluppo di un'intelligenza artificiale completa potrebbe segnare la fine della razza umana... o essere la cosa migliore che le sia mai capitata.", en: 'The development of full artificial intelligence could spell the end of the human race... or be the best thing ever to happen to it.' }, author: 'Stephen Hawking', year: 2014 },
    stats: [
      { value: '100M', label: { it: 'utenti ChatGPT in 2 mesi', en: 'ChatGPT users in 2 months' } },
      { value: '2025', label: { it: 'era degli agenti AI', en: 'era of AI agents' } },
    ],
  },
]

export const milestones: Milestone[] = [
  // VOID (Pre-1950)
  { id: 'llull', name: 'Ars Magna', year: 1305, era: 'void', description: { it: 'Ramon Llull concepisce una macchina logica per il ragionamento universale', en: 'Ramon Llull conceives a logic machine for universal reasoning' }, significance: 4, category: 'event', creator: 'Ramon Llull' },
  { id: 'leibniz', name: 'Calculus Ratiocinator', year: 1679, era: 'void', description: { it: 'Leibniz immagina una macchina per il ragionamento logico universale', en: 'Leibniz envisions a machine for universal logical reasoning' }, significance: 5, category: 'event', creator: 'Gottfried Leibniz' },
  { id: 'lovelace', name: 'Note G', year: 1843, era: 'void', description: { it: 'Ada Lovelace scrive il primo algoritmo della storia', en: 'Ada Lovelace writes the first algorithm in history' }, significance: 7, category: 'paper', creator: 'Ada Lovelace' },
  { id: 'boole', name: 'Algebra Booleana', year: 1854, era: 'void', description: { it: 'George Boole formalizza la logica in algebra', en: 'George Boole formalizes logic into algebra' }, significance: 6, category: 'paper', creator: 'George Boole' },
  { id: 'turing-machine', name: 'Macchina di Turing', year: 1936, era: 'void', description: { it: 'Alan Turing definisce il concetto di computazione universale', en: 'Alan Turing defines the concept of universal computation' }, significance: 9, category: 'paper', creator: 'Alan Turing' },
  { id: 'mcculloch-pitts', name: 'Neurone Artificiale', year: 1943, era: 'void', description: { it: 'McCulloch e Pitts modellano il primo neurone artificiale', en: 'McCulloch and Pitts model the first artificial neuron' }, significance: 7, category: 'paper', creator: 'McCulloch & Pitts' },
  { id: 'eniac', name: 'ENIAC', year: 1945, era: 'void', description: { it: 'Il primo computer elettronico general-purpose viene acceso', en: 'The first general-purpose electronic computer is switched on' }, significance: 6, category: 'event' },
  { id: 'von-neumann', name: 'Architettura Von Neumann', year: 1945, era: 'void', description: { it: 'Von Neumann definisce l\'architettura che ancora oggi e\' alla base di ogni computer — e delle reti neurali future', en: 'Von Neumann defines the architecture that still underlies every computer — and future neural networks' }, significance: 7, category: 'paper', creator: 'John von Neumann' },
  { id: 'cybernetics', name: 'Cibernetica', year: 1948, era: 'void', description: { it: 'Wiener fonda la cibernetica: lo studio dei sistemi di controllo e comunicazione nelle macchine e negli esseri viventi', en: 'Wiener founds cybernetics: the study of control and communication systems in machines and living beings' }, significance: 7, category: 'paper', creator: 'Norbert Wiener' },
  { id: 'shannon-info', name: 'Teoria dell\'Informazione', year: 1948, era: 'void', description: { it: 'Shannon pubblica "A Mathematical Theory of Communication" — nasce l\'era digitale', en: 'Shannon publishes "A Mathematical Theory of Communication" — the digital age is born' }, significance: 8, category: 'paper', creator: 'Claude Shannon' },
  // BIG BANG (1950-1956)
  { id: 'turing-test', name: 'Test di Turing', year: 1950, era: 'bigbang', description: { it: 'Le macchine possono pensare? Turing pone la domanda definitiva', en: 'Can machines think? Turing poses the ultimate question' }, significance: 10, category: 'paper', creator: 'Alan Turing' },
  { id: 'shannon-chess', name: 'Programming a Computer for Playing Chess', year: 1950, era: 'bigbang', description: { it: 'Shannon descrive come un computer potrebbe giocare a scacchi', en: 'Shannon describes how a computer could play chess' }, significance: 5, category: 'paper', creator: 'Claude Shannon' },
  { id: 'samuel-checkers', name: "Samuel's Checkers", year: 1952, era: 'bigbang', description: { it: 'Il primo programma che impara a giocare a dama', en: 'The first program that learns to play checkers' }, significance: 6, category: 'model', creator: 'Arthur Samuel' },
  { id: 'dartmouth', name: 'Dartmouth Conference', year: 1956, era: 'bigbang', description: { it: "Nasce ufficialmente il campo dell'Intelligenza Artificiale", en: 'The field of Artificial Intelligence is officially born' }, significance: 10, category: 'event', creator: 'McCarthy, Minsky, Shannon, Rochester' },
  { id: 'logic-theorist', name: 'Logic Theorist', year: 1956, era: 'bigbang', description: { it: 'Il primo programma AI — dimostra teoremi matematici', en: 'The first AI program — proves mathematical theorems' }, significance: 8, category: 'model', creator: 'Newell, Shaw & Simon' },
  // FIRST STARS (1956-1974)
  { id: 'perceptron', name: 'Perceptron', year: 1958, era: 'stars', description: { it: 'La prima rete neurale hardware', en: 'The first hardware neural network' }, significance: 8, category: 'breakthrough', creator: 'Frank Rosenblatt' },
  { id: 'lisp', name: 'LISP', year: 1958, era: 'stars', description: { it: "Il linguaggio di programmazione dell'AI", en: 'The programming language of AI' }, significance: 7, category: 'product', creator: 'John McCarthy' },
  { id: 'stanford-cart', name: 'Stanford Cart', year: 1961, era: 'stars', description: { it: 'Uno dei primi veicoli autonomi sperimentali', en: 'One of the first experimental autonomous vehicles' }, significance: 5, category: 'product', creator: 'Stanford' },
  { id: 'dendral', name: 'DENDRAL', year: 1965, era: 'stars', description: { it: 'Il primo expert system — analisi chimica automatizzata', en: 'The first expert system — automated chemical analysis' }, significance: 6, category: 'model', creator: 'Feigenbaum, Lederberg' },
  { id: 'eliza', name: 'ELIZA', year: 1966, era: 'stars', description: { it: 'Il primo chatbot — simula uno psicoterapeuta', en: 'The first chatbot — simulates a psychotherapist' }, significance: 8, category: 'model', creator: 'Joseph Weizenbaum' },
  { id: 'shrdlu', name: 'SHRDLU', year: 1971, era: 'stars', description: { it: 'Comprensione del linguaggio naturale in un micro-mondo a blocchi', en: 'Natural language understanding in a blocks micro-world' }, significance: 7, category: 'model', creator: 'Terry Winograd' },
  { id: 'backprop-early', name: 'Backpropagation (Werbos)', year: 1974, era: 'stars', description: { it: 'Werbos descrive la backpropagation — ignorata per un decennio', en: 'Werbos describes backpropagation — ignored for a decade' }, significance: 7, category: 'paper', creator: 'Paul Werbos' },
  // ICE AGE (1974-1993)
  { id: 'lighthill', name: 'Lighthill Report', year: 1973, era: 'ice', description: { it: 'Il rapporto che congela i finanziamenti AI nel Regno Unito', en: 'The report that freezes AI funding in the United Kingdom' }, significance: 7, category: 'event', creator: 'James Lighthill' },
  { id: 'mycin', name: 'MYCIN', year: 1976, era: 'ice', description: { it: 'Expert system per diagnosi medica — accurato ma mai usato', en: 'Expert system for medical diagnosis — accurate but never used' }, significance: 6, category: 'model', creator: 'Stanford' },
  { id: 'hopfield', name: 'Hopfield Network', year: 1982, era: 'ice', description: { it: 'Rete neurale con memoria associativa — un ponte tra fisicae AI', en: 'Neural network with associative memory — a bridge between physics and AI' }, significance: 6, category: 'paper', creator: 'John Hopfield' },
  { id: 'fifth-gen', name: 'Fifth Generation Project', year: 1982, era: 'ice', description: { it: 'Il Giappone investe 400M$ in AI basata su Prolog — fallira\u0300', en: 'Japan invests $400M in Prolog-based AI — it will fail' }, significance: 5, category: 'event', creator: 'MITI Japan' },
  { id: 'backprop-rumelhart', name: 'Backpropagation (Rumelhart)', year: 1986, era: 'ice', description: { it: 'Rumelhart, Hinton e Williams ripopolarizzano la backpropagation', en: 'Rumelhart, Hinton and Williams repopularize backpropagation' }, significance: 8, category: 'paper', creator: 'Rumelhart, Hinton & Williams' },
  { id: 'lenet', name: 'LeNet-5', year: 1989, era: 'ice', description: { it: 'LeCun usa CNN per riconoscere cifre scritte a mano', en: 'LeCun uses CNNs to recognize handwritten digits' }, significance: 7, category: 'model', creator: 'Yann LeCun' },
  // CAMBRIAN (1993-2012)
  { id: 'svm', name: 'Support Vector Machines', year: 1995, era: 'cambrian', description: { it: 'Vapnik introduce le SVM — dominano il ML per un decennio', en: 'Vapnik introduces SVMs — they dominate ML for a decade' }, significance: 6, category: 'paper', creator: 'Vladimir Vapnik' },
  { id: 'deep-blue', name: 'Deep Blue vs Kasparov', year: 1997, era: 'cambrian', description: { it: 'IBM Deep Blue batte il campione mondiale di scacchi', en: 'IBM Deep Blue defeats the world chess champion' }, significance: 9, category: 'event', creator: 'IBM' },
  { id: 'lstm', name: 'LSTM', year: 1997, era: 'cambrian', description: { it: 'Long Short-Term Memory — reti neurali che ricordano', en: 'Long Short-Term Memory — neural networks that remember' }, significance: 7, category: 'paper', creator: 'Hochreiter & Schmidhuber' },
  { id: 'google', name: 'Google / PageRank', year: 1998, era: 'cambrian', description: { it: 'Un algoritmo di ranking rivoluziona la ricerca web', en: 'A ranking algorithm revolutionizes web search' }, significance: 7, category: 'product', creator: 'Larry Page & Sergey Brin' },
  { id: 'darpa-gc', name: 'DARPA Grand Challenge', year: 2005, era: 'cambrian', description: { it: 'Prima gara di veicoli autonomi nel deserto — nessuno finisce (2004), poi Stanley vince (2005)', en: 'First autonomous vehicle race in the desert — none finish (2004), then Stanley wins (2005)' }, significance: 6, category: 'event', creator: 'Stanford / DARPA' },
  { id: 'hinton-dbn', name: 'Deep Belief Networks', year: 2006, era: 'cambrian', description: { it: 'Hinton dimostra che le reti profonde possono essere addestrate — il deep learning rinasce', en: 'Hinton shows deep networks can be trained — deep learning is reborn' }, significance: 8, category: 'breakthrough', creator: 'Geoffrey Hinton' },
  { id: 'imagenet', name: 'ImageNet', year: 2009, era: 'cambrian', description: { it: '14 milioni di immagini etichettate — il dataset che cambiera\u0300 tutto', en: '14 million labeled images — the dataset that will change everything' }, significance: 7, category: 'event', creator: 'Fei-Fei Li' },
  { id: 'siri', name: 'Siri', year: 2011, era: 'cambrian', description: { it: "Apple porta l'assistente vocale AI in ogni tasca", en: 'Apple brings the AI voice assistant to every pocket' }, significance: 6, category: 'product', creator: 'Apple' },
  { id: 'watson-jeopardy', name: 'Watson vince Jeopardy!', year: 2011, era: 'cambrian', description: { it: 'IBM Watson batte i campioni umani al quiz televisivo', en: 'IBM Watson beats human champions on the TV quiz show' }, significance: 7, category: 'event', creator: 'IBM' },
  // INTELLIGENCE (2012-2022)
  { id: 'alexnet', name: 'AlexNet', year: 2012, era: 'intelligence', description: { it: 'Vince ImageNet con un margine enorme — il deep learning e\u0027 reale', en: 'Wins ImageNet by a huge margin — deep learning is real' }, significance: 9, category: 'breakthrough', creator: 'Krizhevsky, Sutskever & Hinton' },
  { id: 'word2vec', name: 'Word2Vec', year: 2013, era: 'intelligence', description: { it: 'Le parole diventano vettori — re - uomo + donna = regina', en: 'Words become vectors — king - man + woman = queen' }, significance: 7, category: 'paper', creator: 'Mikolov et al. (Google)' },
  { id: 'gan', name: 'GAN', year: 2014, era: 'intelligence', description: { it: 'AI che crea immagini dal nulla', en: 'AI that creates images from nothing' }, significance: 8, category: 'breakthrough', creator: 'Ian Goodfellow' },
  { id: 'deepdream', name: 'DeepDream', year: 2015, era: 'intelligence', description: { it: 'L\'AI inizia a "sognare" — nasce l\'arte generativa neurale', en: 'AI starts to "dream" — neural generative art is born' }, significance: 6, category: 'product', creator: 'Google' },
  { id: 'alphago', name: 'AlphaGo vs Lee Sedol', year: 2016, era: 'intelligence', description: { it: 'DeepMind batte il campione mondiale di Go — 10 anni prima del previsto', en: 'DeepMind beats the world Go champion — 10 years ahead of schedule' }, significance: 10, category: 'event', creator: 'DeepMind' },
  { id: 'transformer', name: 'Attention Is All You Need', year: 2017, era: 'intelligence', description: { it: 'Il paper che cambia tutto — nasce il Transformer', en: 'The paper that changes everything — the Transformer is born' }, significance: 10, category: 'paper', creator: 'Vaswani et al. (Google)' },
  { id: 'bert', name: 'BERT', year: 2018, era: 'intelligence', description: { it: 'Comprensione bidirezionale del linguaggio — rivoluziona la NLP', en: 'Bidirectional language understanding — revolutionizes NLP' }, significance: 8, category: 'model', creator: 'Google' },
  { id: 'gpt1', name: 'GPT-1', year: 2018, era: 'intelligence', description: { it: 'Il primo Generative Pre-trained Transformer — 117M parametri', en: 'The first Generative Pre-trained Transformer — 117M parameters' }, significance: 6, category: 'model', creator: 'OpenAI' },
  { id: 'gpt2', name: 'GPT-2', year: 2019, era: 'intelligence', description: { it: '"Troppo pericoloso per essere rilasciato" — generazione di testo credibile', en: '"Too dangerous to release" — believable text generation' }, significance: 7, category: 'model', creator: 'OpenAI' },
  { id: 'openai-five', name: 'OpenAI Five', year: 2019, era: 'intelligence', description: { it: 'AI batte campioni professionisti di Dota 2', en: 'AI beats professional Dota 2 champions' }, significance: 6, category: 'event', creator: 'OpenAI' },
  { id: 'alphafold', name: 'AlphaFold', year: 2020, era: 'intelligence', description: { it: 'Risolve il protein folding — 50 anni di biologia in un colpo', en: 'Solves protein folding — 50 years of biology in one shot' }, significance: 9, category: 'breakthrough', creator: 'DeepMind' },
  { id: 'gpt3', name: 'GPT-3', year: 2020, era: 'intelligence', description: { it: '175 miliardi di parametri — few-shot learning emergente', en: '175 billion parameters — emergent few-shot learning' }, significance: 9, category: 'model', creator: 'OpenAI' },
  { id: 'dalle', name: 'DALL-E', year: 2021, era: 'intelligence', description: { it: "AI che genera immagini dal testo — l'immaginazione artificiale", en: 'AI that generates images from text — artificial imagination' }, significance: 7, category: 'model', creator: 'OpenAI' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', year: 2022, era: 'intelligence', description: { it: "Generazione immagini open source — democratizza l'AI creativa", en: 'Open source image generation — democratizes creative AI' }, significance: 7, category: 'model', creator: 'Stability AI' },
  // SINGULARITY (2022-2026)
  { id: 'chatgpt', name: 'ChatGPT', year: 2022, era: 'singularity', description: { it: "100 milioni di utenti in 2 mesi — l'AI diventa mainstream", en: '100 million users in 2 months — AI goes mainstream' }, significance: 10, category: 'product', creator: 'OpenAI' },
  { id: 'midjourney', name: 'Midjourney', year: 2022, era: 'singularity', description: { it: 'Arte generativa AI accessibile a tutti via Discord', en: 'AI generative art accessible to everyone via Discord' }, significance: 6, category: 'product', creator: 'Midjourney' },
  { id: 'gpt4', name: 'GPT-4', year: 2023, era: 'singularity', description: { it: 'Multimodale, supera esami di medicina e legge', en: 'Multimodal, passes medical and law exams' }, significance: 9, category: 'model', creator: 'OpenAI' },
  { id: 'llama', name: 'LLaMA', year: 2023, era: 'singularity', description: { it: "Meta apre l'era dell'open source LLM", en: 'Meta opens the era of open source LLMs' }, significance: 8, category: 'model', creator: 'Meta' },
  { id: 'claude', name: 'Claude', year: 2023, era: 'singularity', description: { it: "AI sicura, onesta e utile — un nuovo approccio all'allineamento", en: 'Safe, honest and helpful AI — a new approach to alignment' }, significance: 8, category: 'model', creator: 'Anthropic' },
  { id: 'gemini', name: 'Gemini', year: 2023, era: 'singularity', description: { it: 'Google entra nella corsa multimodale', en: 'Google enters the multimodal race' }, significance: 7, category: 'model', creator: 'Google DeepMind' },
  { id: 'llama2', name: 'Llama 2', year: 2023, era: 'singularity', description: { it: 'Open source LLM con licenza commerciale — cambia le regole', en: 'Open source LLM with commercial license — changes the rules' }, significance: 7, category: 'model', creator: 'Meta' },
  { id: 'mixtral', name: 'Mixtral', year: 2024, era: 'singularity', description: { it: 'Mixture of Experts open source — efficienza senza precedenti', en: 'Open source Mixture of Experts — unprecedented efficiency' }, significance: 6, category: 'model', creator: 'Mistral AI' },
  { id: 'claude3-opus', name: 'Claude 3 Opus', year: 2024, era: 'singularity', description: { it: 'Ragionamento avanzato, analisi visiva, coding — un salto generazionale', en: 'Advanced reasoning, visual analysis, coding — a generational leap' }, significance: 7, category: 'model', creator: 'Anthropic' },
  { id: 'sora', name: 'Sora', year: 2024, era: 'singularity', description: { it: 'Generazione video fotorealistica da testo', en: 'Photorealistic video generation from text' }, significance: 7, category: 'model', creator: 'OpenAI' },
  { id: 'devin', name: 'Devin', year: 2024, era: 'singularity', description: { it: 'Il primo "ingegnere software AI" autonomo', en: 'The first autonomous "AI software engineer"' }, significance: 6, category: 'product', creator: 'Cognition' },
  { id: 'o1', name: 'OpenAI o1', year: 2024, era: 'singularity', description: { it: 'Ragionamento chain-of-thought a livello di ricerca', en: 'Research-level chain-of-thought reasoning' }, significance: 7, category: 'model', creator: 'OpenAI' },
  { id: 'claude-opus4', name: 'Claude Opus 4', year: 2025, era: 'singularity', description: { it: 'Ragionamento esteso, agenti autonomi, coding avanzato', en: 'Extended reasoning, autonomous agents, advanced coding' }, significance: 8, category: 'model', creator: 'Anthropic' },
  { id: 'claude-code', name: 'Claude Code', year: 2025, era: 'singularity', description: { it: 'AI che programma nel tuo terminale — il futuro del coding', en: 'AI that codes in your terminal — the future of coding' }, significance: 7, category: 'product', creator: 'Anthropic' },
  { id: 'mercury', name: 'Mercury', year: 2025, era: 'singularity', description: { it: 'Il primo LLM a diffusione commerciale — genera token in parallelo, 5-10x piu\' veloce dei modelli autoregressivi', en: 'The first commercial diffusion LLM — generates tokens in parallel, 5-10x faster than autoregressive models' }, significance: 7, category: 'model', creator: 'Inception Labs' },
  { id: 'gpt5', name: 'GPT-5', year: 2025, era: 'singularity', description: { it: 'Ragionamento multi-step e pianificazione avanzata', en: 'Multi-step reasoning and advanced planning' }, significance: 8, category: 'model', creator: 'OpenAI' },
  { id: 'agents', name: 'Era degli Agenti', year: 2025, era: 'singularity', description: { it: 'AI che pianificano, eseguono e collaborano autonomamente', en: 'AI that plans, executes and collaborates autonomously' }, significance: 8, category: 'breakthrough' },
  { id: 'agi-debate', name: 'Il Dibattito AGI', year: 2026, era: 'singularity', description: { it: "Siamo vicini all'intelligenza artificiale generale? Il mondo si divide", en: 'Are we close to artificial general intelligence? The world is divided' }, significance: 7, category: 'event' },
]

export const eraColors: Record<Era, { main: string; glow: string }> = {
  void: { main: '#4c1d95', glow: '#7c3aed' },
  bigbang: { main: '#f59e0b', glow: '#fbbf24' },
  stars: { main: '#ea580c', glow: '#f97316' },
  ice: { main: '#0ea5e9', glow: '#38bdf8' },
  cambrian: { main: '#10b981', glow: '#34d399' },
  intelligence: { main: '#a855f7', glow: '#c084fc' },
  singularity: { main: '#eab308', glow: '#facc15' },
}

/** Helper to pick text by language */
export function t(bi: BiText, lang: Lang): string {
  return bi[lang]
}
