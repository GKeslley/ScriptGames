export default class outsideClick {
  constructor(element, events, callback) {
    this.element = element;
    this.events = events;
    this.callback = callback;
    this.html = document.documentElement;
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  handleOutsideClick({ target }) {
    if (this.element.contains(target) || !this.element.contains(target)) {
      this.events.forEach((event) => {
        this.html.removeEventListener(event, this.handleOutsideClick);
      });
      this.callback();
    }
  }

  addEventListener() {
    this.events.forEach((event) => {
      setTimeout(() => {
        this.html.addEventListener(event, this.handleOutsideClick);
      });
    });
  }

  init() {
    if (this.element && this.events) {
      this.addEventListener();
    }
    return this;
  }
}
