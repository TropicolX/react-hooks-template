/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useReducer } from "react";
import deepEqual from "fast-deep-equal/es6";
import { usePrevious } from "./usePrevious";

export function usePersistedReducer(reducer, initialState, storageKey) {
	const [state, dispatch] = useReducer(reducer, initialState, init);
	const prevState = usePrevious(state);

	function init() {
		const stringState = localStorage.getItem(storageKey);
		if (stringState) {
			try {
				return JSON.parse(stringState);
			} catch (error) {
				return initialState;
			}
		} else {
			return initialState;
		}
	}

	useEffect(() => {
		const stateEqual = deepEqual(prevState, state);
		if (!stateEqual) {
			const stringifiedState = JSON.stringify(state);
			localStorage.setItem(storageKey, stringifiedState);
		}
	}, [state]);

	return { state, dispatch };
}

// Using the hook
// const initialState = {...}

// function reducer(state = initialState, action) {...}

// const storageKey = 'MY_STORAGE_KEY'

// const { state, dispatch } = usePersistedReducer(reducer, initialState, storageKey)

// use state and dispatch as you normally would.
