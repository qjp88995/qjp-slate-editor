import { eventManager } from "./eventManager";

export const editorMouseMove = (event, editor) => {
    const events = eventManager.filter('editorMouseMove');
    events.forEach(item => item.event(event, editor));
}