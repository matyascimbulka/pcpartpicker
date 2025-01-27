import { Actor } from 'apify';

interface State {
    productsScraped: number;
    maxProducts?: number;
}

class ActorState {
    static LABEL = 'ACTOR_STATE';

    state: State = { productsScraped: 0 };

    async init(maxProducts?: number) {
        this.state = await Actor.useState<State>(ActorState.LABEL, { productsScraped: 0, maxProducts });
    }
}

const actorState = new ActorState();
export default actorState;
