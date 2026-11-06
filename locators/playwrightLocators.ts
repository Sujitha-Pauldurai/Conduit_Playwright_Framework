export const PWLocators = {
    role: 'getByRole',
    title: 'getByTitle',
    text: 'getByText',
    placeholder: 'getByPlaceholder',
    altText: 'getByAltText',
    testId: 'getByTestId',
    label: 'getByLabel',

    roleTypes: {
        button: 'button',
        textbox: 'textbox',
        link: 'link',
        heading: 'heading',
        checkbox: 'checkbox',
        combobox: 'combobox',
        menuitem: 'menuitem',
        list: 'list',
        radio: 'radio'
    }
} as const;