import Author from './Author';
import { Message } from './Message';

export default class MessagesRepository {
	private authors: { [id: string]: Author } = {};
	private messageHistory: Message[] = [];

	addAuthor(author: Author): void {
		this.authors[author.id] = author;
	}

	getAuthor(authorId: string): Author {
		return this.authors[authorId];
	}

	addMessage(text: string, authorId: string) {
		const author: Author = this.getAuthor(authorId);
		this.messageHistory.push({ author: author, text: text });
	}

	getHistory(): Message[] {
		return this.messageHistory;
	}
}
