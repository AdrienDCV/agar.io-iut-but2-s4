// describe('addAuthor', () => {
// 	it('should save the author', function () {
// 		const repository: MessagesRepository = fakeRepositoryWithLinus();
// 		expect(repository.getAuthor('1').name).toEqual('Linus');
// 	});
// });

// describe('addMessage', () => {
// 	it('should save the message in history', function () {
// 		const repository: MessagesRepository = fakeRepositoryWithLinus();
// 		repository.addMessage('Bonjour tout le monde', '1');
// 		expect(repository.getHistory()).toEqual([
// 			{ author: linus(), text: 'Bonjour tout le monde' },
// 		]);
// 	});
// });

// function fakeRepositoryWithLinus() {
// 	const repository = new MessagesRepository();
// 	repository.addAuthor(linus());
// 	return repository;
// }
// function linus() {
// 	return new Author('1', 'Linus');
// }
