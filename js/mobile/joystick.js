export default class moveJoystick {
  constructor(content, joystick) {
    this.content = document.querySelector(content);
    this.joystick = document.querySelector(joystick);
    this.downJoystick = this.downJoystick.bind(this);
    this.moveStick = this.moveStick.bind(this);
    this.moveUpJoystick = this.moveUpJoystick.bind(this);
  }

  downJoystick(event) {
    event.preventDefault();
    this.content.addEventListener("touchmove", this.moveStick);
    this.content.addEventListener("touchstart", this.moveStick);
  }

  moveStick(event) {
    event.preventDefault();
    const screenPostition = event.targetTouches[0];

    const contentRect = this.content.getBoundingClientRect();

    function locals(screenClient, contentMax, stickOffset, contentPosition) {
      let stickPosition = Math.floor(screenClient - contentMax) - stickOffset / 2;

      const contentMaxX = contentPosition - stickOffset;

      let newStickPosition = Math.min(Math.max(stickPosition, 0), contentMaxX);

      return {
        stickPosition,
        newStickPosition,
      };
    }

    const leftElement = locals(
      screenPostition.clientX,
      contentRect.left,
      this.joystick.offsetWidth,
      contentRect.width
    );

    const topElement = locals(
      screenPostition.clientY,
      contentRect.top,
      this.joystick.offsetHeight,
      contentRect.height
    );

    document.body.style.overflow = "hidden";

    this.joystick.style.left = leftElement.newStickPosition + "px";
    this.joystick.style.top = topElement.newStickPosition + "px";

    this.addClass(leftElement, topElement);
  }

  moveUpJoystick() {
    const joyStickWidth = this.joystick.offsetWidth;
    this.joystick.style.left = "14px";
    this.joystick.style.top = "14px";
    let stickClass = this.joystick.getAttribute("class").split("");
    stickClass = stickClass.filter((item) => !item.includes(" "));
    stickClass.forEach((cl) => this.joystick.classList.remove(cl));
    this.content.removeEventListener("touchmove", this.moveStick);
  }

  addClass(leftStick, topStick) {
    if (leftStick.stickPosition < 0) {
      this.joystick.classList.add("a");
      this.joystick.classList.remove("d");
    } else {
      this.joystick.classList.add("d");
      this.joystick.classList.remove("a");
    }

    if (topStick.stickPosition > 30) {
      this.joystick.classList.add("s");
      this.joystick.classList.remove("w");
    } else if (topStick.stickPosition < 20) {
      this.joystick.classList.add("w");
      this.joystick.classList.remove("s");
    }
  }

  eventListener() {
    this.joystick.addEventListener("touchstart", this.downJoystick);
    this.joystick.addEventListener("touchend", this.moveUpJoystick);
    this.content.addEventListener("touchend", this.moveUpJoystick);
  }

  init() {
    if (this.content && this.joystick) {
      this.eventListener();
    }
    return this;
  }
}
