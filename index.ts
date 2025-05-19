import { html, render } from "https://esm.sh/lit-html@3.3.0"
import "https://esm.sh/adorable-css@1.6.2"

render(html`
<div class="w(100%) h(100%) p(20)">
    <canvas
        width="100"
        height="100"
        class="h(100%) b(#555/2)"
    ></canvas>
</div>
`, document.body)
