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
        body: 'Body',
        meta: {
            authorImage: defaultAuthor,
            authorName: 'Henrik Klev',
            publishDate: '15 Aug 2022',
        },
    },
    {
        id: 'create-a-website',
        image: developWithReact,
        title: 'Creating a website',
        subtitle:
            "In this day and age, everyone who is anything has a website. But creating one isn't always a walk in the park. This is how I did it.",
        body: 'Body',
        meta: {
            authorImage: defaultAuthor,
            authorName: 'Henrik Klev',
            publishDate: '14 Aug 2022',
        },
    },
].sort(
    (a, b) => Date.parse(b.meta.publishDate) - Date.parse(a.meta.publishDate)
)
