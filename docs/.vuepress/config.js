module.exports = {
    title: 'Today On Earth API',
    description: 'A feed aggregator and content delegator API',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
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
                collapsable: false,
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
                collapsable: false,
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
                collapsable: false,
                children: [
                    ["/mutations/user", "User"],
                    ["/mutations/post", "Post"],
                    ["/mutations/interest", "Interest"],
                    ["/mutations/provider", "Provider"],
                    ["/mutations/socials", "Socials"]
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
