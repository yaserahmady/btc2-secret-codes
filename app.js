document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(Flip);
});

document.addEventListener("alpine:initializing", () => {
  Alpine.directive(
    "markdown",
    (el, { expression }, { effect, evaluateLater }) => {
      let getHTML = evaluateLater(expression);

      effect(() => {
        getHTML((input) => {
          el.innerHTML = marked(input, { sanitize: true });
        });
      });
    }
  );
});

document.addEventListener("alpine:init", () => {
  Alpine.data("codesList", () => ({
    codes: [],
    selected: null,
    init() {
      fetch("./codes.yaml")
        .then((r) => r.text())
        .then((rawData) => {
          this.codes = jsyaml.load(rawData).codes;
        });
    },
    setClass(index) {
      if (this.selected != null) {
        if (this.selected === index) {
          return "opacity-100";
        } else {
          return "opacity-50";
        }
      } else {
        return "opacity-100";
      }
    },
    toggle(index) {
      if (this.codes[index].state === "expanded") {
        this.collapse(index);
      } else if (this.codes[index].state === "collapsed") {
        this.codes.forEach((c, index) => {
          if (c.state === "expanded") {
            this.collapse(index);
          }
        });
        this.expand(index);
      } else {
        this.codes.forEach((c, index) => {
          if (c.state === "expanded") {
            this.collapse(index);
          }
        });
        this.expand(index);
      }
    },
    expand(index) {
      console.log(`Expanding ${index}`);
      const normal = document.querySelector(`#normal-${index}`),
        hover = document.querySelector(`#hover-${index}`),
        state = Flip.getState(`#normal-${index}, #hover-${index}`);
      this.codes[index].state = "expanded";
      hover.classList.remove("hidden");
      hover.classList.add("visible", "flex");
      normal.classList.add("invisible", "hidden");
      this.selected = index;
      Flip.from(state, {
        duration: 0.3,
        fade: true,
        ease: "power1.inOut",
      });
    },
    collapse(index) {
      console.log(`Collapsing ${index}`);
      const normal = document.querySelector(`#normal-${index}`),
        hover = document.querySelector(`#hover-${index}`),
        state = Flip.getState(`#normal-${index}, #hover-${index}`);
      this.codes[index].state = "collapsed";
      hover.classList.add("hidden");
      hover.classList.remove("visible", "flex");
      normal.classList.remove("invisible", "hidden");
      this.selected = null;
      Flip.from(state, {
        duration: 0.2,
        fade: true,
      });
    },
  }));
});
