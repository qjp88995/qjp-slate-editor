import { eventManager } from "./eventManager";

export const editorMouseUp = (event, editor) => {
    const events = eventManager.filter('editorMouseUp');
    events.forEach(item => item.event(event, editor));
}