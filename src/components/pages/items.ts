import { TimelineItemModel } from 'react-chrono/dist/models/TimelineItemModel'
import { TagCategory, TagWithCategory } from '../common/Tags'
import developWithReact from '../../images/developer-with-react.png'
import defaultAuthor from '../../images/author.png'
import cloudHosting from '../../images/cloud-hosting.png'

export const skillTags: TagWithCategory[] = [
    { tag: 'Kotlin', category: TagCategory.LANGUAGE },
    { tag: 'Java', category: TagCategory.LANGUAGE },
    { tag: 'Android', category: TagCategory.FRAMEWORK },
    {
        tag: 'Jetpack Compose',
        category: TagCategory.FRAMEWORK,
    },
    { tag: 'R', category: TagCategory.LANGUAGE },
    { tag: 'Matlab', category: TagCategory.LANGUAGE },
    { tag: 'JSP', category: TagCategory.LANGUAGE },
    { tag: 'JML', category: TagCategory.OTHER },
    { tag: 'KeY', category: TagCategory.TOOL },
    { tag: 'Azure', category: TagCategory.DEVOPS },
    { tag: 'AWS', category: TagCategory.DEVOPS },
    { tag: 'SQL', category: TagCategory.TECHNOLOGY },
    { tag: 'Git', category: TagCategory.TECHNOLOGY },
    { tag: 'Dagger', category: TagCategory.TECHNOLOGY },
    { tag: 'Spring', category: TagCategory.FRAMEWORK },
    { tag: 'Hibernate', category: TagCategory.TECHNOLOGY },
    { tag: 'React', category: TagCategory.FRAMEWORK },
    { tag: 'TypeScript', category: TagCategory.LANGUAGE },
    { tag: 'HTML', category: TagCategory.LANGUAGE },
    { tag: 'CSS', category: TagCategory.TECHNOLOGY },
    { tag: 'SASS', category: TagCategory.TECHNOLOGY },
    { tag: 'IntelliJ', category: TagCategory.TOOL },
    { tag: 'Docker', category: TagCategory.TECHNOLOGY },
    {
        tag: 'React Redux',
        category: TagCategory.TECHNOLOGY,
    },
    { tag: 'React Saga', category: TagCategory.TECHNOLOGY },
    { tag: 'Jenkins', category: TagCategory.DEVOPS },
    { tag: 'GitHub', category: TagCategory.TOOL },
    { tag: 'Gradle', category: TagCategory.DEVOPS },
    { tag: 'Maven', category: TagCategory.DEVOPS },
    { tag: 'UNIX', category: TagCategory.TECHNOLOGY },
    { tag: 'Windows', category: TagCategory.OTHER },
    { tag: 'Scheme', category: TagCategory.LANGUAGE },
    { tag: 'Stata', category: TagCategory.TOOL },
    { tag: 'Firebase', category: TagCategory.TECHNOLOGY },
    { tag: 'PostgreSQL', category: TagCategory.LANGUAGE },
    { tag: 'Android Studio', category: TagCategory.TOOL },
    { tag: 'JUnit', category: TagCategory.FRAMEWORK },
    { tag: 'Mockito', category: TagCategory.FRAMEWORK },
].sort((a, b) => a.tag.localeCompare(b.tag))

export const storyItems: TimelineItemModel[] = [
    {
        title: 'June 1995',
        cardTitle: 'Genesis',
        cardDetailedText:
            'Twas on a delightful summer evening that the future developer was born in the ' +
            'southernmost hospital that Norway had to offer. The rumors of the magnificent child haunts the ' +
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
            'Celebrating the end of a millennia and survival of Y2k, Henrik started his 19 year long journey of achieving ' +
            'a small piece of paper presenting the underwhelming title "VITNEMÅL". After eventually receiving the paper, ' +
            "Henrik promptly stashed it away somewhere he's now forgotten.",
    },
    {
        title: 'December 2001',
        cardTitle: 'Marvel In Modernity',
        cardDetailedText:
            "Henrik received a DVD of Harry Potter and the Philosopher's Stone. He did not have a DVD player. The DVD was replaced by a VHS. ",
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
            'Remember the illustrious paper Henrik started chasing over a decade ago? There was still five years to go.',
    },
    {
        title: 'June 2020',
        cardTitle: 'Five Years Later',
        cardDetailedText:
            'Five years after it was five years to go, the paper was achieved. It was time to chase another type of paper.',
    },
    {
        title: 'August 2022',
        cardTitle: 'Genesis 2: Electric Boogaloo',
        cardDetailedText:
            'This website joined technical revolution by being added to the magnificent world wide web.',
    },
]

export type BlogItemMetaData = {
    authorImage: string
    authorName: string
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

export const blogItems: BlogItem[] = [
    {
        id: 'host-a-website',
        image: cloudHosting,
        title: 'Hosting a website',
        subtitle:
            "Creating a website is cool, but it's not really useful unless others can see it. To get others to see it, you need to put it on the world wide web. Here is how I did that.",
        body: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.',
        meta: {
            authorImage: defaultAuthor,
            authorName: 'Henrik Klev',
            publishDate: '29 Aug 2022',
        },
    },
    {
        id: 'create-a-website',
        image: developWithReact,
        title: 'Creating a website',
        subtitle:
            "In this day and age, everyone who is anything has a website. But creating one isn't always a walk in the park. This is how I did it.",
        body:
            'Anything that has ever been purposefully created has started out as an idea. That idea is sometimes blurry, oftentimes ambitious, but nearly always exciting. As the idea manifests, its grandiosity increase. And suddenly, what starts as a tiny subconscious spark, fulfills itself in ecstatic glory. \n\n' +
            'For me, the idea of having a personal website came long before I have any idea what it would look like. I only knew I wanted someplace I could portray myself and display my work. Not only because it would benefit me professionally, but also because I was curious. I was curious as to what I could accomplish, to how the result would end up, and to what the process would be.\n\n' +
            'The first step was to get an idea of how the website would look like. It is often at this point that the ambitions can take overhand, which can cause things to feel overwhelming. At this point you should probably remind yourself that millions of other people have created a website before you, and there is probably a bunch of inspiration to find elsewhere. So why not start googling? That is what I did, and I then came across an article [30 Web Developer Portfolios to Inspire You](https://hashnode.com/post/30-web-developer-portfolios-to-inspire-you-cknfx6wdg069kxws1bjjv8mhw), which was exceptionally helpful. The helpfulness came from the wide variety of websites displayed; even though most of them looked like all the designers of GitHub got together to create a website. There were still quite a few that were extremely unique and interesting. After clicking around a bit, it became a bit clearer to me what I wanted. However, it became a lot clearer what I didn’t want. Eventually, I ended up using the website of [Adham Dannaway](https://www.adhamdannaway.com/) as a template. That way I had something to work with.\n\n' +
            'At this point I sort of knew my layout, but there was still a long way to go. The next step is to create the “infrastructure”; that is, the components that will hold images, text and styling. At this point, I simply had to trust the process and have fun with it. Keep asking questions, such as “what if this looked like this…” and “perhaps I should move this…”. Remember to be critical with questions like “do I need this…” and “did this really look that good…?”. Before you know it, you have a product you can be proud of. \n' +
            'The final step is to add things to the site, and here also, only your imagination can stop you. Photos, stories, anecdotes, travel tips, previous work. Remember that you’re doing this only for yourself, and in all honesty, you’re the only one that’s ever going to read what ever you write here. \n\n ' +
            'If you’ve read this far, then definitely contact me. We should have coffee together.',
        meta: {
            authorImage: defaultAuthor,
            authorName: 'Henrik Klev',
            publishDate: '14 Aug 2022',
        },
    },
].sort(
    (a, b) => Date.parse(b.meta.publishDate) - Date.parse(a.meta.publishDate)
)
