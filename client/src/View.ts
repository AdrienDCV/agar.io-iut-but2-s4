/**
 * Classe de base des vues de notre application.
 * Permet d'associer une balise HTML à la vue et de l'afficher/masquer.
 */
export default class View {
	/**
	 * Balise HTML associée à la vue
	 */
	element: HTMLElement;

	constructor(element: HTMLElement) {
		this.element = element;
	}
	/**
	 * Affiche la vue en lui ajoutant la classe CSS `active`
	 */
	show(): void {
		this.element.classList.add('active');
	}
	/**
	 * Masque la vue en enlevant la classe CSS `active`
	 */
	hide(): void {
		this.element.classList.remove('active');
	}
}
