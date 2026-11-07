export const articleLocators = {

    // Navigation
    newArticleLink: 'New Article',
    
    //Page
    articlePage: '.article-page',
    heading: '.article-page h1',

    // Article form
    titleName: 'Article Title',
    descriptionName: "What's this article about?",
    bodyName: 'Write your article (in markdown)',
    tagsName: 'Enter tags',
    publishButtonName: 'Publish Article',

    // Article details
    editArticle: 'Edit Article',
    deleteArticle: 'Delete Article',

    removeTag: (tag: string) => `//span[contains(@class,'tag-pill') and normalize-space()='${tag}']//i`,

    // Feed
    globalFeed: 'Global Feed',
    articleTitle: 'Playwright Automation Testing'
};