export class Question extends HTMLElement {
    static MULTIPLY = '*';
    static DIVIDE = '/';
    static PLUS = '+';
    static MINUS = '-';

    #template = ``;
    #attributes = {};

    #a = 0;
    #b = 0;
    #operator = Question.MULTIPLY;

    constructor() {
        super();
    }

    connectedCallback() {
        // get attributes and convert it to comfortable format
        this.#attributes = {
            a: {
                min: Number(this.getAttribute('a-min')) || 0,
                max: Number(this.getAttribute('a-max')) || 100
            },
            b: {
                min: Number(this.getAttribute('b-min')) || 0,
                max: Number(this.getAttribute('b-max')) || 100
            },
            operator: this.getAttribute('operator') || Question.MULTIPLY
        };

        // generate random numbers
        this.#a = Math.floor(Math.random() * (this.#attributes.a.max - this.#attributes.a.min)) + this.#attributes.a.min;
        this.#b = Math.floor(Math.random() * (this.#attributes.b.max - this.#attributes.b.min)) + this.#attributes.b.min;
        this.#operator = this.#attributes.operator;

        // be sure that a is always greater than b
        if (this.#b > this.#a) {
            [this.#a, this.#b] = [this.#b, this.#a];
        }

        // generate template
        this.#template = `
            <div class="question__a">${this.#a}</div>
            <div class="question__operator">${this.#operator}</div>
            <div class="question__b">${this.#b}</div>
            <div class="question__equals">=</div>
            <div class="question__answer">
                <input class="question__input" type="number" />
            </div>
            <button class="question__check">Check</button>
        `;

        this.className = 'question';
        this.innerHTML = this.#template;

        // add basic event listeners for interactive elements
        this.querySelector('.question__check').addEventListener('click', this.#onCheckClick);
        this.querySelector('.question__input').addEventListener('keypress', this.#onInputKeyPress);
    }

    check() {
        const inputElement = this.querySelector('.question__input');
        const checkElement = this.querySelector('.question__check');

        if (inputElement.value === '') {
            return;
        }

        // check answer according to rules
        let isAnswerCorrect;
        switch (this.#operator) {
            case Question.MULTIPLY:
                isAnswerCorrect = this.#a * this.#b === Number(inputElement.value);
                break;
            case Question.DIVIDE:
                isAnswerCorrect = Math.floor(this.#a / this.#b) === Number(inputElement.value);
                break;
            case Question.PLUS:
                isAnswerCorrect = this.#a + this.#b === Number(inputElement.value);
                break;
            case Question.MINUS:
                isAnswerCorrect = this.#a - this.#b === Number(inputElement.value);
                break;
            default:
                isAnswerCorrect = this.#a * this.#b;
                break;
        }

        this.classList.add(isAnswerCorrect ? 'question_correct' : 'question_incorrect');

        // disable interactive elements to prevent multiple checks
        inputElement.disabled = true;
        checkElement.disabled = true;

        // dispatch event to notify parent component about result
        const event = new CustomEvent('questionChecked', {
            detail: {
                isAnswerCorrect
            }
        });
        this.dispatchEvent(event);
    }

    focus() {
        this.querySelector('.question__input').focus();
    }

    #onCheckClick = (() => {
        const inputElement = this.querySelector('.question__input');

        // prevent empty input
        if (inputElement.value === '') {
            return;
        }

        this.check();
    }).bind(this);

    #onInputKeyPress = ((event) => {
        // check answer on Enter key press
        if (event.key === 'Enter') {
            this.#onCheckClick();
        }
    }).bind(this);
}

customElements.define('game-question', Question);