import { TagCategory, TagWithCategory } from '../common/Tags'
import webDevCover from '../../images/still-no-perfect-program.jpg'
import defaultAuthor from '../../images/henrik-avatar.jpg'
import firiLogo from '../../images/logos/firi.svg'
import skytaleLogo from '../../images/logos/skytale.png'
import orbitLogo from '../../images/logos/orbit.svg'
import payexLogo from '../../images/logos/payex.svg'
import ztlLogo from '../../images/logos/ztl.svg'
import tripletexLogo from '../../images/logos/tripletex.svg'
import uioLogo from '../../images/logos/uio.jpg'
import imfChart3 from '../../images/imf-chart3.png'
import intentTestFlow from '../../images/intent-test-flow.png'

export const skillTags: TagWithCategory[] = [
    { tag: 'Kotlin', category: TagCategory.LANGUAGE },
    { tag: 'Java', category: TagCategory.LANGUAGE },
    { tag: 'Go', category: TagCategory.LANGUAGE },
    { tag: 'C#', category: TagCategory.LANGUAGE },
    { tag: 'TypeScript', category: TagCategory.LANGUAGE },
    { tag: 'Dart', category: TagCategory.LANGUAGE },
    { tag: 'Swift', category: TagCategory.LANGUAGE },
    { tag: 'Python', category: TagCategory.LANGUAGE },
    { tag: 'PHP', category: TagCategory.LANGUAGE },
    { tag: 'SQL', category: TagCategory.LANGUAGE },
    { tag: 'Android', category: TagCategory.FRAMEWORK },
    { tag: 'Jetpack Compose', category: TagCategory.FRAMEWORK },
    { tag: 'Flutter', category: TagCategory.FRAMEWORK },
    { tag: 'React', category: TagCategory.FRAMEWORK },
    { tag: 'React Native', category: TagCategory.FRAMEWORK },
    { tag: 'Next.js', category: TagCategory.FRAMEWORK },
    { tag: 'Node.js', category: TagCategory.FRAMEWORK },
    { tag: '.NET', category: TagCategory.FRAMEWORK },
    { tag: 'Spring', category: TagCategory.FRAMEWORK },
    { tag: 'Laravel', category: TagCategory.FRAMEWORK },
    { tag: 'JUnit', category: TagCategory.FRAMEWORK },
    { tag: 'Mockito', category: TagCategory.FRAMEWORK },
    { tag: 'AWS', category: TagCategory.DEVOPS },
    { tag: 'Azure', category: TagCategory.DEVOPS },
    { tag: 'Azure DevOps', category: TagCategory.DEVOPS },
    { tag: 'Docker', category: TagCategory.DEVOPS },
    { tag: 'Docker Compose', category: TagCategory.DEVOPS },
    { tag: 'Kubernetes', category: TagCategory.DEVOPS },
    { tag: 'Terraform', category: TagCategory.DEVOPS },
    { tag: 'Grafana', category: TagCategory.DEVOPS },
    { tag: 'New Relic', category: TagCategory.DEVOPS },
    { tag: 'Prometheus', category: TagCategory.DEVOPS },
    { tag: 'Kibana', category: TagCategory.DEVOPS },
    { tag: 'Jenkins', category: TagCategory.DEVOPS },
    { tag: 'PostgreSQL', category: TagCategory.TECHNOLOGY },
    { tag: 'MongoDB', category: TagCategory.TECHNOLOGY },
    { tag: 'Redis', category: TagCategory.TECHNOLOGY },
    { tag: 'GraphQL', category: TagCategory.TECHNOLOGY },
    { tag: 'Firebase', category: TagCategory.TECHNOLOGY },
    { tag: 'Firestore', category: TagCategory.TECHNOLOGY },
    { tag: 'FCM', category: TagCategory.TECHNOLOGY },
    { tag: 'SignalR', category: TagCategory.TECHNOLOGY },
    { tag: 'WebRTC', category: TagCategory.TECHNOLOGY },
    { tag: 'Git', category: TagCategory.TOOL },
    { tag: 'GitHub', category: TagCategory.TOOL },
    { tag: 'Bitbucket', category: TagCategory.TOOL },
    { tag: 'Jira', category: TagCategory.TOOL },
    { tag: 'IntelliJ IDEA', category: TagCategory.TOOL },
    { tag: 'Android Studio', category: TagCategory.TOOL },
    { tag: 'VS Code', category: TagCategory.TOOL },
    { tag: 'Claude Code', category: TagCategory.TOOL },
    { tag: 'Cursor', category: TagCategory.TOOL },
    { tag: 'Codex', category: TagCategory.TOOL },
    { tag: 'Gradle', category: TagCategory.TOOL },
    { tag: 'Maven', category: TagCategory.TOOL },
    { tag: 'KeY', category: TagCategory.TOOL },
    { tag: 'OLM', category: TagCategory.OTHER },
    { tag: 'PSD2', category: TagCategory.OTHER },
    { tag: 'Open Banking', category: TagCategory.OTHER },
    { tag: 'Bitcoin', category: TagCategory.OTHER },
    { tag: 'Ethereum', category: TagCategory.OTHER },
    { tag: 'Blockchain', category: TagCategory.OTHER },
    { tag: 'Crypto custody', category: TagCategory.OTHER },
    { tag: 'KYC/AML', category: TagCategory.OTHER },
    { tag: 'MiCA', category: TagCategory.OTHER },
    { tag: 'JML', category: TagCategory.OTHER },
    { tag: 'Agile', category: TagCategory.OTHER },
].sort((a, b) => a.tag.localeCompare(b.tag))

// Tags on the portfolio cards that are not in the skills list above.
const extraTagCategories: Record<string, TagCategory> = {
    Backend: TagCategory.OTHER,
    Crypto: TagCategory.OTHER,
    Fintech: TagCategory.OTHER,
    Architecture: TagCategory.OTHER,
    'Legacy modernization': TagCategory.OTHER,
    'Internal tools': TagCategory.OTHER,
    'End-to-end encryption': TagCategory.OTHER,
    'Deductive verification': TagCategory.OTHER,
    'Formal methods': TagCategory.OTHER,
    'Dynamic logic': TagCategory.OTHER,
    'ISO 20022': TagCategory.OTHER,
    'Nexo Acquirer': TagCategory.OTHER,
    Olm: TagCategory.OTHER,
    Megolm: TagCategory.OTHER,
    Frontend: TagCategory.OTHER,
    DevOps: TagCategory.DEVOPS,
    Monitoring: TagCategory.DEVOPS,
    'Microsoft Azure': TagCategory.DEVOPS,
    Tomcat: TagCategory.DEVOPS,
    Ktor: TagCategory.FRAMEWORK,
    Dagger: TagCategory.FRAMEWORK,
    'JUnit 4': TagCategory.FRAMEWORK,
    'React Redux': TagCategory.FRAMEWORK,
    'React Saga': TagCategory.FRAMEWORK,
    'React Router': TagCategory.FRAMEWORK,
    Cypress: TagCategory.FRAMEWORK,
    Vite: TagCategory.TOOL,
    Webpack: TagCategory.TOOL,
    npm: TagCategory.TOOL,
    ORM: TagCategory.TECHNOLOGY,
    MariaDB: TagCategory.TECHNOLOGY,
    Sass: TagCategory.LANGUAGE,
    JSP: TagCategory.LANGUAGE,
}

const skillCategory = new Map(
    skillTags.map((t) => [t.tag.toLowerCase(), t.category])
)

// Give a card tag the same category, and so the same color, as in the skills section.
export function withCategory(tag: string): TagWithCategory {
    return {
        tag,
        category:
            skillCategory.get(tag.toLowerCase()) ??
            extraTagCategories[tag] ??
            TagCategory.OTHER,
    }
}

export type StoryItem = {
    title: string
    cardTitle: string
    cardDetailedText: string
}

export const storyItems: StoryItem[] = [
    {
        title: 'June 1995',
        cardTitle: 'Genesis',
        cardDetailedText:
            'Twas on a delightful summer evening that the future developer was born in the ' +
            'southernmost hospital that Norway had to offer. The rumors of the magnificent child haunt the ' +
            'halls to this day.',
    },
    {
        title: 'December 1995',
        cardTitle: 'Christmas Past',
        cardDetailedText:
            "Henrik celebrated his first christmas. He remembers exceptionally little, but he's assured the time " +
            'was splendid.',
    },
    {
        title: 'August 2000',
        cardTitle: 'Millennial',
        cardDetailedText:
            'Celebrating the end of a millennium and survival of Y2K, Henrik started his 19 year long journey of achieving ' +
            'a small piece of paper presenting the underwhelming title "VITNEMÅL". After eventually receiving the paper, ' +
            "Henrik promptly stashed it away somewhere he's now forgotten.",
    },
    {
        title: 'December 2001',
        cardTitle: 'Marvel In Modernity',
        cardDetailedText:
            "Henrik received a DVD of Harry Potter and the Philosopher's Stone. He did not have a DVD player. The DVD was replaced by a VHS.",
    },
    {
        title: 'June 2014',
        cardTitle: 'All play and no work',
        cardDetailedText:
            "13 long years, and a whole lot of puberty later, Henrik graduated from high school. Adhering to Norway's " +
            'long traditions, he celebrated by drinking ungodly amounts of beer.',
    },
    {
        title: 'July 2015',
        cardTitle: 'The Year-Long Hangover Cure',
        cardDetailedText:
            'Is the best way to cure a graduation-party hangover to join the Norwegian Armed Forces? Probably not. ' +
            'Still, after a year of mandatory service in the frantic cold the northern lands had to offer, Henrik resigned from his position as lance corporal. ' +
            'It was time to start a new chapter in the big city.',
    },
    {
        title: 'August 2015',
        cardTitle: 'Chasing The Paper',
        cardDetailedText:
            'Remember the illustrious paper Henrik started chasing over a decade ago? There were still five years to go.',
    },
    {
        title: 'June 2020',
        cardTitle: 'Five Years Later',
        cardDetailedText:
            'Five years after it was five years to go, the paper was achieved: an MSc in Informatics, and a thesis on formally verifying the Norwegian election software. It was time to chase another type of paper.',
    },
    {
        title: 'October 2020',
        cardTitle: 'Money, Money, Money',
        cardDetailedText:
            'Henrik joined Tripletex, and learned that accountants care a great deal about bank reconciliation. Now, so does he.',
    },
    {
        title: 'November 2021',
        cardTitle: 'Open Sesame',
        cardDetailedText:
            'Henrik joined the fintech scale-up ZTL Payment Solutions, and got to know PSD2 and Open Banking a little too well.',
    },
    {
        title: 'May 2022',
        cardTitle: "Always tappin'",
        cardDetailedText:
            'Crime. Crime never sleeps. Neither does money. Henrik joined PayEx to make it easier for people to spend money. Albeit, he made it harder to do crime.',
    },
    {
        title: 'August 2022',
        cardTitle: 'Genesis 2: Electric Boogaloo',
        cardDetailedText:
            'This website joined the technical revolution by being added to the magnificent world wide web.',
    },
    {
        title: 'May 2023',
        cardTitle: "Those who can't do, teach.",
        cardDetailedText:
            'Henrik became technical advisor for the startups Remote and Orbit, and found out that inherited legacy systems are a lot like inherited furniture (they have bugs that keep you up at night).',
    },
    {
        title: 'February 2025',
        cardTitle: 'The name is Rik, Henrik',
        cardDetailedText:
            "As lead Android developer at Skytale, Henrik built end-to-end encrypted messaging, calls and file sharing. He could tell you about it, but he'll have to.. you know..",
    },
    {
        title: 'February 2026',
        cardTitle: 'To The Moon',
        cardDetailedText: "Henrik joined Firi. If you can't beat them...",
    },
]

export type Project = {
    id: string
    // The company logo, shown on a tile. logoBg is the tile color for light-on-dark logos.
    image: string
    logoBg?: string
    company: string
    project: string
    role: string
    period: string
    text: string
    tags: string[]
    link?: { label: string; url: string }
}

const tripletexTags = [
    'Java',
    'React',
    'TypeScript',
    'React Redux',
    'React Saga',
    'React Router',
    'MariaDB',
    'AWS',
    'SQL',
    'Grafana',
    'Prometheus',
    'Cypress',
    'Spring',
    'ORM',
    'Maven',
    'Docker',
    'Tomcat',
    'Webpack',
    'Vite',
    'Node.js',
    'npm',
    'Jenkins',
    'Kibana',
    'Sass',
    'JSP',
]

const tripletexBasic =
    'Tripletex is one of the leading accounting systems in Norway, and has been running for more than 20 years. ' +
    'I was part of the Piggy Bank Crew, the team responsible for banking and bank integrations, with a handful of developers, a QA and a UX designer. ' +
    'I was also a member of the Security Council, the Front-End Developer Council and the Social Committee.'

export const projects: Project[] = [
    {
        id: 'firi',
        image: firiLogo,
        company: 'Firi',
        project: 'Crypto Exchange',
        role: 'Senior backend developer',
        period: 'Feb 2026 - Present',
        text:
            'Firi is a Norwegian cryptocurrency exchange, registered with the Financial Supervisory Authority of Norway. ' +
            'As a senior backend developer, I work on the systems that let customers buy, sell and store crypto safely, ' +
            'and on the compliance systems behind them. ' +
            'Since I joined in February 2026, I have mainly worked on:\n\n' +
            '• Automated reporting of suspicious activity to the Norwegian authorities, with accounts, transactions and involved parties, through Maskinporten\n' +
            '• Better anti-money-laundering checks, using device and login information\n' +
            '• A more robust card payment pipeline, with Kafka, stored webhooks and retries\n' +
            '• A second card payment provider, with 3-D Secure, fraud checks and settlement reports\n' +
            '• Support tools, such as withdrawing coins on behalf of a customer and faster customer search\n' +
            '• Security checks on withdrawals, and monitoring of staking rewards',
        tags: [
            'Go',
            'gRPC',
            'Kafka',
            'PostgreSQL',
            'Terraform',
            'TypeScript',
            'React',
            'Backend',
            'Fintech',
            'Crypto',
            'KYC/AML',
        ],
        link: { label: 'firi.com', url: 'https://firi.com' },
    },
    {
        id: 'skytale',
        image: skytaleLogo,
        logoBg: '#0b1e3a',
        company: 'Skytale',
        project: 'Secure Communication Platform',
        role: 'Lead Android developer',
        period: 'Feb 2025 - 2026',
        text:
            'Skytale is a secure, end-to-end encrypted communication platform for security-conscious organizations. ' +
            'As lead developer for the Android app, I implemented key features, such as:\n\n' +
            '• P2P encrypted audio and video calls using WebRTC\n' +
            '• P2P and group encrypted messaging using the Olm and Megolm encryption protocols\n' +
            '• P2P encrypted transfer of large files\n' +
            '• User onboarding and verification\n' +
            '• Data synchronization using SignalR',
        tags: [
            'Kotlin',
            'Android',
            'Jetpack Compose',
            'WebRTC',
            'Olm',
            'Megolm',
            'SignalR',
            'End-to-end encryption',
        ],
        link: { label: 'skytale.no', url: 'https://skytale.no' },
    },
    {
        id: 'orbit',
        image: orbitLogo,
        company: 'Remote & Orbit',
        project: 'Startup Tech Advisor',
        role: 'Technical advisor',
        period: 'May 2023 - 2025',
        text:
            'Remote and Orbit are two startups. ' +
            'As their key technical advisor, I was responsible for the deployment, monitoring, development and architecture of their systems. ' +
            'I modernized and deployed the inherited legacy systems, which span several technologies and applications.',
        tags: ['Architecture', 'DevOps', 'Monitoring', 'Legacy modernization'],
        link: { label: 'getorbit.com', url: 'https://www.getorbit.com' },
    },
    {
        id: 'payex',
        image: payexLogo,
        company: 'PayEx',
        project: 'Android Payment Terminal',
        role: 'Android developer, consultant',
        period: 'May 2022 - 2024',
        text:
            'PayEx is a leading Nordic payment provider, with complete payment solutions for stores and e-commerce. ' +
            'As an Android developer in a large agile team, I helped build a next-generation payment app for the PAX terminal family, ' +
            'used by major retailers such as Coop, Volvo and Reitan Retail. ' +
            'I led modernization efforts, implemented key features, built test tools, onboarded new team members and automated test procedures.',
        tags: [
            'Kotlin',
            'Android',
            'Jetpack Compose',
            'Dagger',
            'Mockito',
            'JUnit 4',
            'Gradle',
            'Agile',
            'Fintech',
            'Git',
            'Jira',
            'GitHub',
            'Nexo Acquirer',
            'Docker',
        ],
    },
    {
        id: 'ztl',
        image: ztlLogo,
        company: 'ZTL Payment Solution',
        project: 'PSD2 B2B Payment Solution',
        role: 'Fullstack developer, consultant',
        period: 'Nov 2021 - May 2022',
        text:
            'ZTL Payment Solution is a fintech scale-up that uses the PSD2 APIs of banks to offer real-time payments and account services. ' +
            'As a full-stack developer in an agile team, I focused on the transaction reconciliation system, ' +
            'and helped build their REST API-based payment solution and internal management system. ' +
            'The payment solution was written in Kotlin with Ktor, JDBI and PostgreSQL, and hosted on Microsoft Azure. ' +
            'The management system used React and TypeScript.',
        tags: [
            'Kotlin',
            'React',
            'TypeScript',
            'Fintech',
            'Git',
            'Jira',
            'Bitbucket',
            'PSD2',
            'Open Banking',
            'ISO 20022',
            'New Relic',
            'Grafana',
            'PostgreSQL',
            'Microsoft Azure',
            'Ktor',
            'Docker',
            'Node.js',
            'npm',
            'Sass',
        ],
    },
    {
        id: 'tripletex',
        image: tripletexLogo,
        company: 'Tripletex',
        project: 'Banking & Payments',
        role: 'Fullstack developer, team security lead, frontend lead',
        period: 'Oct 2020 - Nov 2021',
        text:
            tripletexBasic +
            '\n\nIncoming payments (Oct 2020 - Feb 2021)\n' +
            'My first project was to fetch, parse, post and reconcile incoming payments automatically. ' +
            'When the project was finished, customers received all the payments for their accounts automatically in their accounting systems, ' +
            'where each payment was closed against the correct invoice and reconciled against the corresponding bank statement entry.' +
            '\n\nTechnical debt (Feb 2021 - May 2021)\n' +
            'My second project was about paying down technical debt. ' +
            'When a system becomes as large, old and complex as that of Tripletex, technical debt accumulates and ' +
            'latency increases. By systematically analyzing the system in its multi-threaded setting, ' +
            'and exposing the bottlenecks that caused the most perceived latency, some modules became as ' +
            'much as 15 times more efficient.' +
            '\n\nSbanken integration (May 2021 - Nov 2021)\n' +
            'My last project was an integration with the PSD2 API of Sbanken. ' +
            'As a result, all customers with an account in Sbanken received all their account information and payments directly in ' +
            'Tripletex. This gave customers full control over their accounts, enabled automatic reconciliation and closing of invoices, and let them ' +
            'pay their invoices directly from Tripletex.',
        tags: [...tripletexTags, 'PSD2', 'Open Banking'],
    },
    {
        id: 'uio-engineer',
        image: uioLogo,
        company: 'University of Oslo',
        project: 'IMS and ITS',
        role: 'Principal engineer',
        period: 'Aug 2018 - Jun 2020',
        text:
            'The University of Oslo is the oldest and largest university in Norway. ' +
            'Alongside my studies, I worked as a front-end developer on internal projects for system and user administration, ' +
            'maintenance of technical equipment and technical support.',
        tags: ['Frontend', 'Internal tools'],
    },
    {
        id: 'uio-msc',
        image: uioLogo,
        company: 'University of Oslo',
        project: 'MSc. Informatics',
        role: 'Researcher',
        period: 'Aug 2018 - Jun 2020',
        text:
            "For my Master's thesis, I formally verified parts of EVA, the official software that calculates the results of Norwegian elections. " +
            'With deductive verification and dynamic logic, I mathematically proved that core parts of the seat allocation match their specification, ' +
            'and that they can never fail to do so, no matter the input. ' +
            'The work was done on the real, Java-based system using JML and KeY, with guidance from the Reliable Systems group at the University of Oslo ' +
            'and the Formal Methods division at the University of Gothenburg. ' +
            'I graduated with a GPA of 3.6/4.',
        tags: [
            'Java',
            'JUnit 4',
            'JML',
            'KeY',
            'Deductive verification',
            'Formal methods',
            'Dynamic logic',
        ],
        link: {
            label: 'Read the thesis',
            url: 'https://www.mn.uio.no/ifi/english/research/groups/psy/completedmasters/2020/klev/',
        },
    },
]

export type BlogItemMetaData = {
    authorImage: string
    authorName: string
    // ISO date. 'YYYY-MM' shows only month and year.
    publishDate: string
}

export type BlogItem = {
    id: string
    image: string
    title: string
    subtitle: string
    body: string
    meta: BlogItemMetaData
}

const verifyingEva = `In 2020 I finished my master's thesis at the University of Oslo: [Verifying EVA: Formal Verification of the Software Deciding Norwegian Governmental Elections](https://www.mn.uio.no/ifi/english/research/groups/psy/completedmasters/2020/klev/). It is 137 pages long, and took 5 years to create. This post is the short version, which explains it in 5 minutes.

## What is EVA?

EVA (Elektronisk Valgadministrasjon) is the system that municipalities and counties in Norway use to run elections. It holds the party lists and the electoral roll, it registers votes on election day, and it calculates the result. In other words: when the votes are counted, EVA decides who gets the seats.

If that calculation is wrong by a single seat, the consequences can be serious. So the question of my thesis was simple to ask and hard to answer: **can we prove that EVA calculates the seats correctly?**

## Why testing is not enough

Testing is the normal way to gain confidence in software. But as Dijkstra famously wrote:

> Program testing can be used to show the presence of bugs, but never to show their absence!

Tests check the inputs that you think of. Some bugs only appear for inputs that nobody thinks of. The thesis opens with a small example: a function that must always return false, but returns true for exactly one input, because of integer overflow. No reasonable test suite finds it.

Formal verification takes another approach. Instead of trying inputs, you write down exactly what the code must do (a *specification*), and then you prove mathematically that the code does it, for **every** possible input.

## The algorithm: Sainte-Laguë's modified method

Norway allocates seats with Sainte-Laguë's modified method. Each party's votes are divided by 1.4, 3, 5, 7 and so on. All these quotients are sorted, and the seats go to the highest quotients, one by one. On top of this, the seats at large (*utjevningsmandater*) are allocated to even out the result across the country.

This part of EVA, called EVA Resultat, was my verification target. It is written in Java, it runs in sequence and not distributed, and it uses standard libraries heavily, such as \`BigDecimal\` for exact arithmetic and \`Arrays.sort\` for ranking the quotients. That combination made it a good real-world case.

## How: JML and KeY

I used two tools:

- **JML (Java Modeling Language)**: you write contracts as comments on each method. A contract says what must be true before the method runs (preconditions), what must be true after (postconditions), and what stays true inside loops (loop invariants).
- **The KeY System**: a proof assistant that turns the Java code and its JML contracts into logical proof obligations, and then helps you prove them in a logic called Java Dynamic Logic.

Much of the work was not the proofs, but the specifications. A proof only shows that the code matches the specification. If the specification is wrong, the proof is worthless. Writing down exactly what "correct" means for an election law turned out to be a large part of the job.

## What I proved

- **The quotient classes** (\`Kvotient\` and \`PartiKvotient\`) were verified against their specifications with few changes to the source code. The only method that needed a different implementation was \`compareTo\`, which decides the order of the quotients. That order matters: if it is wrong, seats go to the wrong party.
- **The allocation of seats** was proven to conform to its specification.
- **The seats at large** were only partly verified, because of problems in KeY when creating objects from library stubs inside nested loops. I presented an alternative implementation with some verified properties, and a less formal argument that the method is correct.

Along the way I built reusable parts: stubs with contracts for common Java library methods such as \`arraycopy\` and \`sort\`, and loop invariants for common patterns. I also documented the bugs and glitches I found in KeY itself, so that the next person does not lose faith in a correct proof that the tool fails to close.

## A small finding about precision

EVA uses \`BigDecimal\` with 20 decimal places, so that two quotients only count as equal if they really are. But the Electoral Law already says what to do when quotients are equal: the seat goes to the party with the most votes. And in practice, 20 decimals are rarely needed. In the 2019 municipal election in Oslo, only one pair of quotients among the first 21 divisors could not be separated by the first decimal, and those were the 175th and 176th highest quotients, far below the 58 seats that were decided.

## What it took

The effort took about 6 to 9 person-months, done by someone (me) with intermediate knowledge of Java and logic, but no earlier experience with formal verification, JML, KeY or EVA. That is maybe the most useful result for others: formal verification of a real, running system is within reach, and it is not only for aviation or space.

## What is left

A program is not fully verified until all the code it depends on is verified too, including the Java libraries. The natural next steps are to verify those libraries, finish the seats-at-large proofs, and make tools like KeY support common data structures better. Standard JML could also learn some of the keywords that KeY adds.

## Why I still care

Elections depend on trust. As more of the process becomes digital, people need reasons to trust the software that counts their votes. A mathematical proof removes at least one reason for doubt. I still think about this thesis whenever I write code that handles money or other people's data: tests tell me what I checked, a specification tells me what I actually mean.

## Sources

- Henrik Torland Klev. [Verifying EVA: Formal Verification of the Software Deciding Norwegian Governmental Elections](https://www.mn.uio.no/ifi/english/research/groups/psy/completedmasters/2020/klev/) ([PDF](https://www.mn.uio.no/ifi/english/research/groups/psy/completedmasters/2020/klev/masterthesis-klev.pdf)). Master's thesis, University of Oslo, 2020.
- [The KeY Project](https://www.key-project.org/) and the [Java Modeling Language](https://en.wikipedia.org/wiki/Java_Modeling_Language).`

const luckyStabs = `On 25 June 2026, the Norwegian Supreme Court set aside a conviction for attempted murder ([HR-2026-1432-A](https://www.domstol.no/no/hoyesterett/avgjorelser/avgjorelser-2026/hoyesterett---straff/HR-2026-1432-A/)). The court did not say that the accused was innocent. It said that the court of appeal had asked the wrong question, and had not explained its answer well enough for anyone to check it.

I am not a lawyer, but I do appreciate it when judges and lawyers must pretend to be philosophers.

## What happened

In February 2023, B came to an apartment in Oslo to pay a drug debt to A. The cash covered only a small part of the debt. B was hit, kicked and stabbed five times: once in the chest, twice in the stomach and twice in the thigh. The court of appeal found that A made four of the stabs, including the one in the chest.

The knife was a large kitchen knife with a blade of about 20 cm. The chest stab entered from the side, went about two centimetres in, and punctured a lung. According to the forensic expert, that injury alone could have killed B "after a relatively short time" without treatment. B survived partly because he got medical help fast, and partly because of where the blade happened to hit.

The district court and the court of appeal both convicted A of attempted murder. Together with the other counts, among them deprivation of liberty, a drug offence and drunk driving, the sentence was six and a half years in prison.

## What the law asks

Under § 22 of the Penal Code, intent has three forms: (a) purpose, (b) awareness that the act "certainly or most likely" fulfils the offence, or (c) seeing the outcome as possible and choosing to act anyway. This case was about letter b. So A must have been aware that B would most likely die. The court is precise about what is not enough: it is "not sufficient that the offender realised that the act was dangerous, that the victim could die, or that death was foreseeable".

Stabbings are often spontaneous, and the court of appeal found that A did not actively think about the risk of death. So the courts use a two-step test from earlier cases:

1. Is it common knowledge that a stab like this will most likely kill?
2. If so, is there anything to suggest that A, in this situation, did not have that knowledge?

The court of appeal answered the first step like this: it is common knowledge that a large kitchen knife stabbed with some force into the chest will most likely cause death. The Supreme Court said that this is the wrong level. The question is not about "a knife in the chest" in general. It is about this stab: from the side, about two centimetres deep, into a lung.

The court of appeal also did not consider the situation. The stabbing happened during debt collection, and B had still not paid. A dead debtor pays nothing, so B's death was not in A's interest. That does not rule out intent, but it is part of the picture of what A thought would happen.

Okay, yes: a dead debtor pays nothing. But the argument cuts both ways. In a drug-debt setting, reputation is the only way to collect. If one debtor can skip a payment without consequences, other debtors can stop respecting the collector too. So violence can serve A's interest, even when B's death does not. The goal can be to punish B and to warn everyone else, and then a serious risk of death is not something that A would necessarily avoid. This is my point, not the court's, but I found it interesting how the court didn't seem to even consider that
B's death could be in the interest of A.

![How the court decides what A knew: the two-step test, and where the court of appeal went wrong](${intentTestFlow})

## One standard, many kinds of people

The test is built around a "normally equipped person". The court presumes that A knew what everyone knows, unless there are concrete signs that he did not. This is a practical solution. A court must judge people of every kind: calm, panicked, sober, drunk, quick, slow, people who have never seen violence and people who love it. It cannot build a separate standard for each person, so it starts from the average and adjusts.

The judgment is honest about the risks. The court warns that the method can make the intent requirement "objective", so that the question becomes what a typical person would know, not what this person knew. It insists that common knowledge must be what people actually know, "and not what it ought to be". And it admits that the average is hard to find: both parties presented research on the outcome of stab wounds, and the court said that the research did not settle what is common knowledge either.

The standard can fail at both ends of the spectrum:

- **People who know less than the standard assumes.** Someone with reduced cognitive ability, in panic, or drunk may not grasp a risk that the court calls common knowledge. The presumption means that the defence must point to concrete signs of this. If those signs are hard to show, a person can be convicted for knowledge that they did not have.
- **People who know more than the standard assumes.** Someone with medical training may know exactly how dangerous a stab is. If that is not common knowledge, the court needs separate proof of what this person knew. When that proof is hard to find, real intent can go unpunished. In this case, the same mechanism worked the other way: the court of appeal used A's experience of having witnessed a knife killing as evidence that he knew the risk.

In both directions, the more a case depends on what an average person knows, the less it depends on what this person knew. The Supreme Court gives a good control question: is there a realistic possibility that a normally equipped person would not understand that the stab would most likely kill? If yes, the presumption cannot carry a conviction.

## Attempted murder is a blunt charge

The case also shows why I think attempted murder is often a poor fit.

Two people can do exactly the same thing. One victim dies. The other survives, because the blade hit a lung and not the heart, or because the ambulance was close. The first attacker faces a murder charge. The second faces attempted murder, and the law allows a lower sentence for an attempt, even below the minimum sentence for murder (§ 80 b). The act and the state of mind can be identical. Only luck is different. Philosophers call this *moral luck*.

The charge can fail in two directions:

- **Too lenient.** A person who really tried to kill can get a lighter sentence because the attempt "failed".
- **Too strict.** A person who meant to hurt or to scare can be charged with attempted murder because the act could have killed. The label then says more about the injury than about the intent.

My own reading of this case is that A was aware that B could die, and stabbed anyway. That B survived was luck, not A's choice. But under letter b, "could die" is exactly what the law says is not enough. My description sounds closer to letter c: seeing death as possible and choosing to act anyway. The Supreme Court did not assess letter c, because the case was about letter b. I would like to know why.

## A practical bundle, not a perfect theory

In practice, attempted murder bundles very different acts into one charge. You can miss a shot, be too weak to stangle, or stab impulsively during a debt dispute. In all cases, death came close, and that the prosecution believes that it can prove intent to kill.

This doesn't feel to me like the perfect way to enact justice. A better system would grade the act by the risk that the person knowingly created, not by where the blade happened to land. But the justice system cannot measure the risk that someone saw in their own head. It has a few labels: bodily harm, aggravated bodily harm (§ 274, up to 10 years in prison), attempted murder, and murder (§ 275, 8 to 21 years). It must fit messy events into them. Attempted murder is the label for the space between "badly hurt" and "dead" when the prosecution thinks that the intent went all the way. The courts then use the sentence to adjust for everything that the label cannot express.

Seen this way, the decision is not a technicality. It forces the court of appeal to describe the actual act before it applies the label.

## What happens next

The Supreme Court set aside the conviction for attempted murder, the sentence for the deprivation of liberty, and the compensation for non-economic loss. It set the sentence for the drug and traffic counts to eight months in prison. The court of appeal must now assess the attempted murder count again. A has not been acquitted.

## What I take from this

- A legal standard built on the "normally equipped person" is practical, but it can fail both people who know less and people who know more.
- For intent, the question is always about this person and this act. A general category, such as "a knife in the chest", is not enough.
- With attempted murder, luck decides much of the outcome. The charge can be too lenient and too strict.
- In practice, the charge bundles many kinds of acts. The precision must come from the reasons and the sentence.

## Sources

- Supreme Court of Norway. [HR-2026-1432-A, summary](https://www.domstol.no/no/hoyesterett/avgjorelser/avgjorelser-2026/hoyesterett---straff/HR-2026-1432-A/) and [full judgment (PDF)](https://www.domstol.no/globalassets/upload/hret/avgjorelser/2026/juni/hr-2026-1432-a.pdf). 25 June 2026.
- The judgment on Lovdata: [HR-2026-1432-A](https://lovdata.no/dokument/HRSTR/avgjorelse/hr-2026-1432-a?q=26-019785STR-HRET).
- [The Penal Code (straffeloven)](https://lovdata.no/lov/2005-05-20-28), §§ 16, 22, 80, 274 and 275.`

const readingBetweenTheDots = `In March 2026, the IMF published [High Debt, Hard Choices](https://www.imf.org/en/publications/fandd/issues/2026/03/high-debt-hard-choices-era-dabla-norris) by Era Dabla-Norris and Rodrigo Valdés. The article argues that high public debt forces governments into hard trade-offs, and that public trust decides whether citizens accept those trade-offs.

To support the point about trust, the article shows Chart 3. The chart splits survey respondents into two groups: people who trust the government, and people who do not. For each group, it shows the share who agree with four statements.

![Chart 3, Trust shifts optimism, from the IMF article High Debt, Hard Choices](${imfChart3})

*Chart 3 from High Debt, Hard Choices. Source: IMF, Finance & Development, March 2026.*

I've read the chart multiple times, but there is one thing I still don't understand - how correect is it?

## The problem with totals

Imagine a survey of 100 people. 75 say that they trust the government. 60 say that government policy will make them better off. From these two totals, you cannot tell how many of the 60 are among the 75. It could be all 60. It could be 35.

To split one answer by another, each person's answers must stay linked. You need the survey at the level of the individual respondent, not only the totals. So I went looking for that data.

## What the paper says

The source of the chart is a working paper by Francesco Bianchi, Era Dabla-Norris and Salma Khalid: [Perceptions of Public Debt and Policy Expectations: Evidence from Cross-Country Surveys](https://www.nber.org/papers/w34382) (NBER Working Paper 34382).

The paper answers my main question. YouGov ran the survey online in April and May 2024. After the authors removed speeders and people who failed attention checks, 27,202 respondents in 13 countries remained. Each respondent completed the full questionnaire, and the regressions in the paper use one row per respondent. So the data do exist at the individual level. Chart 3 is a cross-tabulation: sort the respondents by one answer, then count the other answers inside each group.

The trust question is Q9_2 in the questionnaire: *"The government can be trusted to do the right thing."* The scale has five steps from "Strongly agree" to "Strongly disagree", plus "Don't know". The note under Chart 3 says that neutral answers go into the "do not trust" group. So "do not trust" really means "does not say that they trust".

As far as I can match them, the four rows come from these questions:

- **Policies will stabilize or reduce the debt level:** Q30. The survey asked this question only to respondents who expected tax increases or spending cuts.
- **Policies will make the respondent better off:** Q31.
- **Debt is harmful for current and future taxpayers:** Q35_3 and Q35_4, answered "somewhat harmful" or "very harmful".

If that match is right, the first row has a smaller base than the other three. The chart does not show this.

What I could not find: the microdata, or a table with the numbers behind Chart 3. The paper does not say whether the data are public, so I could not reproduce the chart. I emailed Dr. Dabla-Norris to ask how the chart was made. I still have not yet received a response.

In the email, I also pointed out a small typo: one label in Chart 3 says "hamrful". In fairness, a chart about trust is hard to trust completely when a label is misspelled. However, I realise that pointing out typos is a dangerous hobby for anyone who writes a blog.

## Percent or percentage points?

The article says that respondents with more trust "are 20 percent more likely to believe that its policies will help stabilize or reduce public debt", and "17 percent more likely to expect a positive impact on their own welfare".

Now look at the chart. About 75 percent of the trusting group expect debt to stabilize or fall, against about 56 percent of the other group. That is a gap of about 20 percentage points. In relative terms, the trusting group is about a third more likely to hold this view.

For the second statement, the shares are about 23 and 6 percent. That is a gap of 17 percentage points. In relative terms, the trusting group is three to four times as likely to expect to be better off.

So "20 percent more likely" seems to mean 20 percentage points. The difference matters. "17 percent more likely" sounds like a small effect. "Almost four times as likely" does not.

## Correlation, not cause

Chart 3 shows raw shares. It does not control for anything. People who trust their government can differ from people who do not in many ways: country, age, income or political view. Each of these can also affect how they see debt.

The paper does control for such factors. In its regressions (Annex Table A.12), trust stays a strong and significant predictor after the authors add country and age fixed effects and the respondents' other beliefs. But those coefficients are in standard deviations of standardized outcomes, not in percent. You cannot read them as "20 percent" either.

Trust is also not randomized in the survey. The randomized experiment in the paper gives respondents information about debt. It does not change their trust. So the data show that trust and optimism go together. They do not show that more trust would make people more optimistic.

## The trust paradox

The bottom two rows interest me most. People who trust the government are *less* likely to say that the current debt level harms taxpayers: about 45 against 61 percent for current taxpayers, and about 50 against 63 percent for future taxpayers. For future taxpayers, the regressions in the paper point the same way.

The article argues that trust makes hard reforms possible. The chart suggests that trust can also make the problem look smaller. People who trust the government may accept reform, but they may also see less reason for it. The chart subtitle says that "concern about high debt remains broad across all groups". That is true, but on these two rows the gap goes the opposite way.

## What I take from this

- A chart that splits one answer by another needs linked data for each respondent. Totals are not enough.
- Read the note under the chart. Here, neutral answers count as distrust, and one row probably has a smaller base.
- "Percent more likely" and "percentage points more likely" are different claims. Check which one the numbers support.
- A difference between groups in a survey shows a correlation. To show a cause, you need an experiment.

If I get a reply, I will update this post.

## Sources

- Era Dabla-Norris and Rodrigo Valdés. [High Debt, Hard Choices](https://www.imf.org/en/publications/fandd/issues/2026/03/high-debt-hard-choices-era-dabla-norris). Finance & Development, IMF, March 2026.
- Francesco Bianchi, Era Dabla-Norris and Salma Khalid. [Perceptions of Public Debt and Policy Expectations: Evidence from Cross-Country Surveys](https://www.nber.org/papers/w34382). NBER Working Paper 34382, 2025.`

export const blogItems: BlogItem[] = [
    {
        id: 'verifying-eva',
        image: uioLogo,
        title: 'Proving an election correct',
        subtitle:
            'How I used formal methods to prove that parts of EVA, the software that decides Norwegian elections, calculate the seats correctly.',
        body: verifyingEva,
        meta: {
            authorImage: defaultAuthor,
            authorName: 'Henrik Klev',
            publishDate: '2024-01-29',
        },
    },
    {
        id: 'lucky-stabs',
        image: intentTestFlow,
        title: 'Lucky stabs and the average person',
        subtitle:
            "Norway's Supreme Court set aside a conviction for attempted murder. The case shows how hard it is to judge very different people by one standard, and why attempted murder is a blunt tool.",
        body: luckyStabs,
        meta: {
            authorImage: defaultAuthor,
            authorName: 'Henrik Klev',
            publishDate: '2026-09-23',
        },
    },
    {
        id: 'reading-between-the-dots',
        image: imfChart3,
        title: 'Reading between the dots',
        subtitle:
            'An IMF chart compares people who trust their government with people who do not. I wanted to know how you build a chart like that from a survey. Here is what I found.',
        body: readingBetweenTheDots,
        meta: {
            authorImage: defaultAuthor,
            authorName: 'Henrik Klev',
            publishDate: '2026-04-02',
        },
    },
    {
        id: 'create-a-website',
        image: webDevCover,
        title: 'Still no perfect program',
        subtitle:
            'In this day and age, everyone and everything has a website. Even me! This is how I created it, and what changed four years later.',
        body: `Everything that someone made on purpose started as an idea. The idea is often blurry, usually ambitious and nearly always exciting. This website started the same way.

I wanted a personal website long before I knew what it would look like. I wanted a place to present myself and show my work. It would help me professionally, but mostly I was curious: what could I build, what would the result look like, and what would the process be like?

## Step 1: Find inspiration

The first step was to decide how the site should look. This is where ambition can take over and make the whole thing feel overwhelming. It helps to remember that millions of people have built a website before you, so there is plenty of inspiration out there.

So I started searching, and found the article [30 Web Developer Portfolios to Inspire You](https://hashnode.com/post/30-web-developer-portfolios-to-inspire-you-cknfx6wdg069kxws1bjjv8mhw). The range of sites helped the most. Many of them looked like the GitHub design team had built them together, but quite a few were unique and interesting. After clicking around, I got a better idea of what I wanted, and a much clearer idea of what I did not want. In the end, I used the website of [Adham Dannaway](https://www.adhamdannaway.com/) as a template. That gave me something concrete to start from.

## Step 2: Build the structure

With a layout in mind, the next step was the "infrastructure": the components that hold the images, the text and the styling. Here I had to trust the process and have fun with it. Keep asking questions such as "what if this looked like this?" and "should I move this?". Be critical too: "do I need this?" and "did that really look good?". Before you know it, you have something that you are proud of.

## Step 3: Fill it

The last step is to add content, and only your imagination sets the limit: photos, stories, anecdotes, travel tips, previous work. Remember that you do this for yourself. In all honesty, you are probably the only one who will ever read it.

## Update, September 2026: four years later

In 2026, the site got a big refresh. The original tools had aged: Create React App and node-sass are no longer maintained. The site now builds with Vite, React 19 and TypeScript. In the same round, I:

- made the layout work on phones,
- cut the images from about 32 MB to about 3 MB,
- replaced the timeline library with a small custom component,
- gave each blog post its own page, so that you can link to it,
- and added a dark mode.

The design is mostly the same. The question from step 2 still holds up: "do I need this?". A large part of the refresh was removing things.

If you have read this far, contact me. We should have coffee together.`,
        meta: {
            authorImage: defaultAuthor,
            authorName: 'Henrik Klev',
            publishDate: '2022-08-14',
        },
    },
].sort((a, b) => b.meta.publishDate.localeCompare(a.meta.publishDate))

export type ResumeEntry = {
    period: string
    title: string
    place: string
    text?: string
    link?: { label: string; url: string }
}

export const experience: ResumeEntry[] = [
    {
        period: '2026 - Present',
        title: 'Senior Backend Developer',
        place: 'Firi · Oslo',
    },
    {
        period: '2025 - 2026',
        title: 'Lead Android Developer',
        place: 'Skytale · Oslo / Remote',
        text: 'End-to-end encrypted calls, messaging and file sharing with WebRTC, Olm, Megolm and SignalR.',
    },
    {
        period: '2023 - 2025',
        title: 'Technical Advisor',
        place: 'remote.no & getorbit.com · Remote',
        text: 'Deployment, monitoring, development and architecture. Modernized inherited legacy systems.',
    },
    {
        period: '2022 - 2024',
        title: 'Android Developer, Consultant',
        place: 'PayEx · Oslo',
        text: 'Next-generation payment app for the PAX terminal family. Led modernization, test tools and test automation.',
    },
    {
        period: '2021 - 2022',
        title: 'Developer, Consultant',
        place: 'ZTL Payment Solutions · Oslo',
        text: 'Transaction reconciliation, PSD2, Open Banking and REST APIs at a fintech scale-up.',
    },
    {
        period: '2020 - 2021',
        title: 'Full-Stack Developer',
        place: 'Tripletex · Oslo',
        text: 'Digital payments, bank agreements, customer onboarding and bank reconciliation.',
    },
    {
        period: '2018 - 2020',
        title: 'Principal Engineer',
        place: 'University of Oslo · Oslo',
        text: 'Front-end developer for internal tools for system and user administration.',
    },
]

export const education: ResumeEntry[] = [
    {
        period: '2018 - 2020',
        title: 'MSc. Informatics',
        place: 'University of Oslo',
        text: 'Programming and System Architecture: Software. GPA 3.6/4.',
        link: {
            label: 'Thesis: Verifying EVA',
            url: 'https://www.mn.uio.no/ifi/english/research/groups/psy/completedmasters/2020/klev/',
        },
    },
    {
        period: '2015 - 2018',
        title: 'BSc. Informatics',
        place: 'University of Oslo',
        text: 'Nanoelectronics.',
    },
    {
        period: '2011 - 2014',
        title: 'High School',
        place: 'Mandal VGS · Mandal',
    },
]

export const spokenLanguages = ['Norwegian', 'English']

export const favoriteLanguages = ['Kotlin', 'Node.js', 'Java', 'Go']
