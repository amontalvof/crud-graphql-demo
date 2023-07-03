const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require('graphql');

const { authors, books } = require('./data');

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter((book) => book.authorId === author.id);
            },
        },
    }),
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find((author) => author.id === book.authorId);
            },
        },
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A Single Book',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) =>
                books.find((book) => book.id === args.id),
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'A list of books',
            resolve: () => books,
        },
        author: {
            type: AuthorType,
            description: 'A Single Author',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: (parent, args) =>
                authors.find((author) => author.id === args.id),
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors,
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId,
                };
                books.push(book);
                return book;
            },
        },
        updateBook: {
            type: BookType,
            description: 'Update a book',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const book = books.find((book) => book.id === args.id);
                book.name = args.name;
                book.authorId = args.authorId;
                return book;
            },
        },
        deleteBook: {
            type: BookType,
            description: 'Delete a book',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const book = books.find((book) => book.id === args.id);
                books.splice(books.indexOf(book), 1);
                return book;
            },
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = { id: authors.length + 1, name: args.name };
                authors.push(author);
                return author;
            },
        },
        updateAuthor: {
            type: AuthorType,
            description: 'Update an author',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = authors.find((author) => author.id === args.id);
                author.name = args.name;
                return author;
            },
        },
        deleteAuthor: {
            type: AuthorType,
            description: 'Delete an author',
            args: {
                id: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const author = authors.find((author) => author.id === args.id);
                authors.splice(authors.indexOf(author), 1);
                return author;
            },
        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});

module.exports = schema;
