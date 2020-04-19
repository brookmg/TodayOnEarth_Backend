module.exports = {
    title: 'Today On Earth API',
    description: 'A feed aggregator and content delegator API',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {

        algolia: {
            apiKey: process.env.ALGOLIA_API_KEY,
            indexName: 'toeapi'
        },

        sidebar: [
            '/',
            {
                title: "Guide",
                collapsable: false,
                children: [
                    ["/guide/setup", "Setup"]
                ]
            },
            {
                title: "Models",
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ["/models/user", "User"],
                    ["/models/socials", "Socials"],
                    ["/models/post", "Post"],
                    ["/models/interest", "Interest"],
                    ["/models/provider", "Provider"]
                ]
            },
            {
                title: "Queries",
                collapsable: true,
                children: [
                    ["/queries/user", "User"],
                    ["/queries/post", "Post"],
                    ["/queries/interest", "Interest"],
                    ["/queries/provider", "Provider"],
                    ["/queries/native", "Native"]
                ]
            },
            {
                title: "Mutations",
                collapsable: true,
                children: [
                    ["/mutations/user", "User"],
                    ["/mutations/post", "Post"],
                    ["/mutations/interest", "Interest"],
                    ["/mutations/provider", "Provider"],
                    ["/mutations/socials", "Socials"]
                ]
            },
            {
                title: "Subscriptions",
                collapsable: true,
                children: [
                    ["/subscriptions/post", "Post"],
                    ["/subscriptions/user", "User"]
                ]
            },
            {
                title: "Contribution",
                collapsable: true,
                children: [
                    ["/contribution/tech", "Technologies Used"],
                    ["/contribution/people", "People Involved"]
                ]
            },
        ],
        sidebarDepth: 2,
        smoothScroll: true,
        displayAllHeaders: true,

        repo: 'brookmg/TodayOnEarth_Backend',
        repoLabel: 'Contribute ⚡',
        docsDir: 'docs',
        docsBranch: 'doc',
        editLinks: true,
        editLinkText: 'Contribute to this project by editing this page'

    },
    dest: 'docs/public'
};
