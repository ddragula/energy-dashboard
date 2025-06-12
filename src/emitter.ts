class EventEmitter {
    private listeners: Record<string, Function[]> = {};

    public on(eventName: string, listener: Function): () => void {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }

        this.listeners[eventName].push(listener);

        return () => {
            this.listeners[eventName] = this.listeners[eventName].filter(l => l !== listener);
        };
    }

    public emit(eventName: string, payload?: any, async = true): void {
        if (!this.listeners[eventName]) {
            return;
        }

        this.listeners[eventName].forEach(listener => {
            if (async) {
                setTimeout(() => {
                    listener(payload);
                }, 0);
            } else {
                listener(payload);
            }
        });
    }
}

export default new EventEmitter();
