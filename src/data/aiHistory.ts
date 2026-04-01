export type Era = 'void' | 'bigbang' | 'stars' | 'ice' | 'cambrian' | 'intelligence' | 'singularity'
export type Category = 'model' | 'paper' | 'event' | 'product' | 'breakthrough'

export interface Milestone {
  id: string
  name: string
  year: number
  era: Era
  description: string
  significance: number // 1-10
  category: Category
  creator?: string
}

export interface EraInfo {
  id: Era
  name: string
  cosmicName: string
  period: string
  tagline: string
  description: string
  color: string // hex
  glowColor: string // hex with more saturation
}

export const eras: EraInfo[] = [
  {
    id: 'void',
    name: 'Il Vuoto',
    cosmicName: 'Proto-Materia',
    period: 'Pre-1950',
    tagline: 'I sogni delle macchine pensanti',
    description: 'Prima che l\'intelligenza artificiale avesse un nome, visionari come Leibniz, Babbage e Ada Lovelace immaginavano macchine capaci di ragionare. Nel vuoto cosmico, la materia primordiale inizia ad aggregarsi — idee sparse come polvere di stelle, in attesa di una scintilla.',
    color: '#4c1d95',
    glowColor: '#7c3aed',
  },
  {
    id: 'bigbang',
    name: 'Il Big Bang',
    cosmicName: 'La Nascita',
    period: '1950 — 1956',
    tagline: 'L\'intelligenza artificiale nasce',
    description: 'Alan Turing pubblica "Computing Machinery and Intelligence" e chiede: le macchine possono pensare? Nel 1956, alla Dartmouth Conference, un gruppo di pionieri conia il termine "Artificial Intelligence". L\'universo dell\'AI esplode in esistenza — un Big Bang di idee che si espandono in ogni direzione.',
    color: '#f59e0b',
    glowColor: '#fbbf24',
  },
  {
    id: 'stars',
    name: 'Le Prime Stelle',
    cosmicName: 'L\'Età dell\'Oro',
    period: '1956 — 1974',
    tagline: 'I primi programmi che "pensano"',
    description: 'Come le prime stelle che si accendono nell\'universo giovane, i primi programmi AI illuminano il panorama: ELIZA simula uno psicoterapeuta, il Perceptron promette di imparare, SHRDLU comprende il linguaggio naturale in un mondo a blocchi. L\'ottimismo è alle stelle — letteralmente. Si predice che in 20 anni le macchine supereranno l\'uomo.',
    color: '#ea580c',
    glowColor: '#f97316',
  },
  {
    id: 'ice',
    name: 'Le Ere Glaciali',
    cosmicName: 'L\'Inverno Cosmico',
    period: '1974 — 1993',
    tagline: 'Le promesse infrante',
    description: 'Il Lighthill Report del 1973 gela i finanziamenti britannici. Le reti neurali cadono in disgrazia. Gli expert systems degli anni \'80 promettono e deludono. Due "inverni dell\'AI" congelano il progresso — come ere glaciali cosmiche dove le stelle si spengono e il vuoto torna a dominare. Ma sotto il ghiaccio, la vita persiste.',
    color: '#0ea5e9',
    glowColor: '#38bdf8',
  },
  {
    id: 'cambrian',
    name: 'L\'Esplosione Cambriana',
    cosmicName: 'Il Rinascimento',
    period: '1993 — 2012',
    tagline: 'La diversità esplode',
    description: 'Internet porta dati. I dati portano possibilità. Come nell\'esplosione cambriana che riempì gli oceani di forme di vita diverse, l\'AI si diversifica: Support Vector Machines, Random Forests, Deep Blue batte Kasparov, IBM Watson vince a Jeopardy. Le fondamenta del deep learning vengono poste da Hinton, LeCun, Bengio — i tre che non si arresero durante l\'inverno.',
    color: '#10b981',
    glowColor: '#34d399',
  },
  {
    id: 'intelligence',
    name: 'L\'Intelligenza Emerge',
    cosmicName: 'La Vita Complessa',
    period: '2012 — 2022',
    tagline: 'Le reti neurali risvegliate',
    description: 'AlexNet vince ImageNet 2012 e il deep learning esplode. Le GAN generano volti mai esistiti. AlphaGo batte il campione mondiale di Go — un momento che nessuno credeva possibile per decenni. Nel 2017, "Attention Is All You Need" introduce il Transformer. GPT, BERT, T5 emergono come organismi sempre più complessi in un ecosistema che evolve a velocità vertiginosa.',
    color: '#a855f7',
    glowColor: '#c084fc',
  },
  {
    id: 'singularity',
    name: 'La Singolarità',
    cosmicName: 'La Civiltà',
    period: '2022 — 2026',
    tagline: 'L\'intelligenza diventa universale',
    description: 'ChatGPT raggiunge 100 milioni di utenti in 2 mesi. GPT-4 supera gli esami di medicina e legge. Claude ragiona in modo sicuro. Gemini vede e ascolta. I modelli open source democratizzano l\'accesso. Gli agenti AI iniziano a collaborare. Come una civiltà che emerge su un pianeta — luci si accendono una dopo l\'altra, connesse, sempre più brillanti. Non sappiamo dove ci porterà. Ma il viaggio è iniziato.',
    color: '#eab308',
    glowColor: '#facc15',
  },
]

export const milestones: Milestone[] = [
  // ERA: VOID (Pre-1950)
  { id: 'leibniz', name: 'Calculus Ratiocinator', year: 1679, era: 'void', description: 'Leibniz immagina una macchina per il ragionamento logico universale', significance: 5, category: 'event', creator: 'Gottfried Leibniz' },
  { id: 'lovelace', name: 'Note G', year: 1843, era: 'void', description: 'Ada Lovelace scrive il primo algoritmo della storia per la macchina di Babbage', significance: 7, category: 'paper', creator: 'Ada Lovelace' },
  { id: 'boole', name: 'Algebra Booleana', year: 1854, era: 'void', description: 'George Boole formalizza la logica in algebra — le fondamenta del computing', significance: 6, category: 'paper', creator: 'George Boole' },
  { id: 'turing-machine', name: 'Macchina di Turing', year: 1936, era: 'void', description: 'Alan Turing definisce il concetto di computazione universale', significance: 9, category: 'paper', creator: 'Alan Turing' },
  { id: 'mcculloch-pitts', name: 'Neurone Artificiale', year: 1943, era: 'void', description: 'McCulloch e Pitts modellano il primo neurone artificiale', significance: 7, category: 'paper', creator: 'McCulloch & Pitts' },
  { id: 'eniac', name: 'ENIAC', year: 1945, era: 'void', description: 'Il primo computer elettronico general-purpose viene acceso', significance: 6, category: 'event' },

  // ERA: BIG BANG (1950-1956)
  { id: 'turing-test', name: 'Test di Turing', year: 1950, era: 'bigbang', description: '"Computing Machinery and Intelligence" — Le macchine possono pensare?', significance: 10, category: 'paper', creator: 'Alan Turing' },
  { id: 'samuel-checkers', name: 'Samuel\'s Checkers', year: 1952, era: 'bigbang', description: 'Il primo programma che impara a giocare a dama — machine learning ante litteram', significance: 6, category: 'model', creator: 'Arthur Samuel' },
  { id: 'dartmouth', name: 'Dartmouth Conference', year: 1956, era: 'bigbang', description: 'Nasce ufficialmente il campo dell\'Intelligenza Artificiale', significance: 10, category: 'event', creator: 'McCarthy, Minsky, Shannon, Rochester' },
  { id: 'logic-theorist', name: 'Logic Theorist', year: 1956, era: 'bigbang', description: 'Il primo programma AI — dimostra teoremi matematici', significance: 8, category: 'model', creator: 'Newell, Shaw & Simon' },

  // ERA: FIRST STARS (1956-1974)
  { id: 'perceptron', name: 'Perceptron', year: 1958, era: 'stars', description: 'Frank Rosenblatt costruisce la prima rete neurale hardware', significance: 8, category: 'breakthrough', creator: 'Frank Rosenblatt' },
  { id: 'lisp', name: 'LISP', year: 1958, era: 'stars', description: 'John McCarthy crea il linguaggio di programmazione dell\'AI', significance: 7, category: 'product', creator: 'John McCarthy' },
  { id: 'eliza', name: 'ELIZA', year: 1966, era: 'stars', description: 'Il primo chatbot — simula uno psicoterapeuta rogersiano', significance: 8, category: 'model', creator: 'Joseph Weizenbaum' },
  { id: 'shakey', name: 'Shakey the Robot', year: 1966, era: 'stars', description: 'Il primo robot mobile a ragionare sulle proprie azioni', significance: 6, category: 'product', creator: 'SRI International' },
  { id: 'shrdlu', name: 'SHRDLU', year: 1971, era: 'stars', description: 'Comprensione del linguaggio naturale in un micro-mondo a blocchi', significance: 7, category: 'model', creator: 'Terry Winograd' },
  { id: 'backprop-early', name: 'Backpropagation (Werbos)', year: 1974, era: 'stars', description: 'Paul Werbos descrive la backpropagation nella sua tesi — ignorata per un decennio', significance: 7, category: 'paper', creator: 'Paul Werbos' },

  // ERA: ICE AGE (1974-1993)
  { id: 'lighthill', name: 'Lighthill Report', year: 1973, era: 'ice', description: 'Il rapporto che congela i finanziamenti AI nel Regno Unito', significance: 7, category: 'event', creator: 'James Lighthill' },
  { id: 'mycin', name: 'MYCIN', year: 1976, era: 'ice', description: 'Expert system per diagnosi medica — accurato ma mai usato in pratica', significance: 6, category: 'model', creator: 'Stanford' },
  { id: 'backprop-rumelhart', name: 'Backpropagation (Rumelhart)', year: 1986, era: 'ice', description: 'Rumelhart, Hinton e Williams ripopolarizzano la backpropagation', significance: 8, category: 'paper', creator: 'Rumelhart, Hinton & Williams' },
  { id: 'expert-systems-crash', name: 'Crollo Expert Systems', year: 1987, era: 'ice', description: 'Il mercato dei sistemi esperti crolla — inizia il secondo inverno AI', significance: 6, category: 'event' },
  { id: 'lenet', name: 'LeNet-5', year: 1989, era: 'ice', description: 'Yann LeCun usa CNN per riconoscere cifre scritte a mano', significance: 7, category: 'model', creator: 'Yann LeCun' },

  // ERA: CAMBRIAN (1993-2012)
  { id: 'svm', name: 'Support Vector Machines', year: 1995, era: 'cambrian', description: 'Vapnik introduce le SVM — dominano il ML per un decennio', significance: 6, category: 'paper', creator: 'Vladimir Vapnik' },
  { id: 'deep-blue', name: 'Deep Blue vs Kasparov', year: 1997, era: 'cambrian', description: 'IBM Deep Blue batte il campione mondiale di scacchi', significance: 9, category: 'event', creator: 'IBM' },
  { id: 'lstm', name: 'LSTM', year: 1997, era: 'cambrian', description: 'Long Short-Term Memory — reti neurali che ricordano', significance: 7, category: 'paper', creator: 'Hochreiter & Schmidhuber' },
  { id: 'roomba', name: 'Roomba', year: 2002, era: 'cambrian', description: 'L\'AI entra nelle case sotto forma di aspirapolvere autonomo', significance: 4, category: 'product', creator: 'iRobot' },
  { id: 'netflix-prize', name: 'Netflix Prize', year: 2006, era: 'cambrian', description: 'La competizione che democratizza il machine learning applicato', significance: 5, category: 'event', creator: 'Netflix' },
  { id: 'imagenet', name: 'ImageNet', year: 2009, era: 'cambrian', description: 'Il dataset che cambierà tutto — 14 milioni di immagini etichettate', significance: 7, category: 'event', creator: 'Fei-Fei Li' },
  { id: 'watson-jeopardy', name: 'Watson vince Jeopardy!', year: 2011, era: 'cambrian', description: 'IBM Watson batte i campioni umani al quiz televisivo', significance: 7, category: 'event', creator: 'IBM' },
  { id: 'siri', name: 'Siri', year: 2011, era: 'cambrian', description: 'Apple porta l\'assistente vocale AI in ogni tasca', significance: 6, category: 'product', creator: 'Apple' },

  // ERA: INTELLIGENCE (2012-2022)
  { id: 'alexnet', name: 'AlexNet', year: 2012, era: 'intelligence', description: 'Vince ImageNet con un margine enorme — il deep learning è reale', significance: 9, category: 'breakthrough', creator: 'Krizhevsky, Sutskever & Hinton' },
  { id: 'word2vec', name: 'Word2Vec', year: 2013, era: 'intelligence', description: 'Le parole diventano vettori — re - uomo + donna = regina', significance: 7, category: 'paper', creator: 'Mikolov et al. (Google)' },
  { id: 'gan', name: 'GAN', year: 2014, era: 'intelligence', description: 'Generative Adversarial Networks — AI che crea immagini dal nulla', significance: 8, category: 'breakthrough', creator: 'Ian Goodfellow' },
  { id: 'alphago', name: 'AlphaGo vs Lee Sedol', year: 2016, era: 'intelligence', description: 'DeepMind batte il campione mondiale di Go — 10 anni prima del previsto', significance: 10, category: 'event', creator: 'DeepMind' },
  { id: 'transformer', name: 'Attention Is All You Need', year: 2017, era: 'intelligence', description: 'Il paper che cambia tutto — nasce l\'architettura Transformer', significance: 10, category: 'paper', creator: 'Vaswani et al. (Google)' },
  { id: 'bert', name: 'BERT', year: 2018, era: 'intelligence', description: 'Comprensione bidirezionale del linguaggio — rivoluziona la NLP', significance: 8, category: 'model', creator: 'Google' },
  { id: 'gpt2', name: 'GPT-2', year: 2019, era: 'intelligence', description: '"Troppo pericoloso per essere rilasciato" — generazione di testo credibile', significance: 7, category: 'model', creator: 'OpenAI' },
  { id: 'alphafold', name: 'AlphaFold', year: 2020, era: 'intelligence', description: 'Risolve il protein folding — 50 anni di biologia in un colpo', significance: 9, category: 'breakthrough', creator: 'DeepMind' },
  { id: 'gpt3', name: 'GPT-3', year: 2020, era: 'intelligence', description: '175 miliardi di parametri — few-shot learning emergente', significance: 9, category: 'model', creator: 'OpenAI' },
  { id: 'dalle', name: 'DALL-E', year: 2021, era: 'intelligence', description: 'AI che genera immagini dal testo — l\'immaginazione artificiale', significance: 7, category: 'model', creator: 'OpenAI' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', year: 2022, era: 'intelligence', description: 'Generazione di immagini open source — democratizza l\'AI creativa', significance: 7, category: 'model', creator: 'Stability AI' },

  // ERA: SINGULARITY (2022-2026)
  { id: 'chatgpt', name: 'ChatGPT', year: 2022, era: 'singularity', description: '100 milioni di utenti in 2 mesi — l\'AI diventa mainstream', significance: 10, category: 'product', creator: 'OpenAI' },
  { id: 'gpt4', name: 'GPT-4', year: 2023, era: 'singularity', description: 'Multimodale, supera esami di medicina e legge, ragionamento avanzato', significance: 9, category: 'model', creator: 'OpenAI' },
  { id: 'llama', name: 'LLaMA', year: 2023, era: 'singularity', description: 'Meta apre l\'era dell\'open source LLM', significance: 8, category: 'model', creator: 'Meta' },
  { id: 'claude', name: 'Claude', year: 2023, era: 'singularity', description: 'AI sicura, onesta e utile — un nuovo approccio all\'allineamento', significance: 8, category: 'model', creator: 'Anthropic' },
  { id: 'gemini', name: 'Gemini', year: 2023, era: 'singularity', description: 'Google entra nella corsa multimodale con il suo modello più potente', significance: 7, category: 'model', creator: 'Google DeepMind' },
  { id: 'mixtral', name: 'Mixtral', year: 2024, era: 'singularity', description: 'Mixture of Experts open source — efficienza senza precedenti', significance: 6, category: 'model', creator: 'Mistral AI' },
  { id: 'sora', name: 'Sora', year: 2024, era: 'singularity', description: 'Generazione video fotorealistica da testo — il cinema AI', significance: 7, category: 'model', creator: 'OpenAI' },
  { id: 'claude-opus', name: 'Claude Opus 4', year: 2025, era: 'singularity', description: 'Ragionamento esteso, agenti autonomi, coding avanzato', significance: 8, category: 'model', creator: 'Anthropic' },
  { id: 'gpt5', name: 'GPT-5', year: 2025, era: 'singularity', description: 'Capacità di ragionamento multi-step e pianificazione avanzata', significance: 8, category: 'model', creator: 'OpenAI' },
  { id: 'agents', name: 'Era degli Agenti', year: 2025, era: 'singularity', description: 'AI che pianificano, eseguono e collaborano autonomamente', significance: 8, category: 'breakthrough' },
  { id: 'agi-debate', name: 'Il Dibattito AGI', year: 2026, era: 'singularity', description: 'Siamo vicini all\'intelligenza artificiale generale? Il mondo si divide', significance: 7, category: 'event' },
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
