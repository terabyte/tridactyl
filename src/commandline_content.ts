/** Inject an input element into unsuspecting webpages and provide an API for interaction with tridactyl */

/* TODO:
    CSS
    Friendliest-to-webpage way of injecting commandline bar?
    Security: how to prevent other people's JS from seeing or accessing the bar or its output?
        - Method here is isolation via iframe
            - Web content can replace the iframe, but can't view or edit its content.
            - see doc/escalating-privilege.md for other approaches.
*/

// inject the commandline iframe into a content page

let cmdline_iframe: HTMLIFrameElement = undefined

function init(){
    if (cmdline_iframe === undefined && window.document.body !== null) {
        try {
            console.log("INIT")
            cmdline_iframe = window.document.createElement("iframe")
            cmdline_iframe.setAttribute("src", browser.extension.getURL("static/commandline.html"))
            cmdline_iframe.setAttribute("id", "cmdline_iframe")
            hide()
            window.document.body.appendChild(cmdline_iframe)
        } catch (e) {
            console.error("Couldn't initialise cmdline_iframe!", e)
        }
    }
}

// TODO: Propagate awaits back through messaging system or resend
// commandline_frame messages from excmd_content if you want to avoid init'ing
// every time.
document.addEventListener("DOMContentLoaded", init)
// This second call will fail in the most common case, but makes web-ext reloads effective.
init()

export function show(){
    const height = cmdline_iframe.contentWindow.document.body.offsetHeight + 'px'
    cmdline_iframe.setAttribute("style", `height: ${height};`)
}

export function hide(){
    cmdline_iframe.setAttribute("style", "height: 0px;")
}

export function focus(){
    cmdline_iframe.focus()
}

export function blur() {
    cmdline_iframe.blur()
}

import * as Messaging from './messaging'
import * as SELF from './commandline_content'
Messaging.addListener('commandline_content', Messaging.attributeCaller(SELF))
