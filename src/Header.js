export class Header extends HTMLElement {
    #template = `
    <h1 class="header__title">Math Game</h1>
    <div class="header__progress">
        <div class="header__level">Your level 1/100</div>
        <div class="header__score">Your score 0/100</div>  
    </div>          
    `;

    #levelElement;
    #scoreElement;

    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.#template;
        this.classList.add('header');

        this.#levelElement = this.querySelector('.header__level');
        this.#scoreElement = this.querySelector('.header__score');
    }

    setLevel = ((level) => {
        this.#levelElement.textContent = `Your level ${level}/100`;
    }).bind(this);

    setScore = ((score) => {
        this.#scoreElement.textContent = `Your score ${score}/100`;
    }).bind(this);
}

customElements.define('game-header', Header);