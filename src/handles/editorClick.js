import { eventManager } from "./eventManager";

export const editorClick = (event, editor) => {
    const events = eventManager.filter('editorClick');
    events.forEach(item => item.event(event, editor));
}