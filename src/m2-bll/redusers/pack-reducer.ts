import {cardsPackAPI} from "../../m3-dal/api";
import {ActionLoginType, setErrorAC, setIsFetchingAC} from "./auth-reducer";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../state/store";

export type CardsPackInitialStateType = {
    cardsPack: CardPacksType[]
    pageSize: number
    currentPage: number
    cardPacksTotalCount: number
    portionSize: number
    userPackId: string
    sort: undefined | string
    isPrivat: boolean
    packName: string | undefined
    minCardsCount: number
    maxCardsCount: number
    checkedCount: number[] | number
}

const initialState: CardsPackInitialStateType = {
    cardsPack: [] as CardPacksType[],
    pageSize: 6,
    currentPage: 1,
    cardPacksTotalCount: 0,
    portionSize: 10,
    userPackId: '',
    sort: '',
    isPrivat: false,
    packName: '',
    minCardsCount: 0,
    maxCardsCount: 50,
    checkedCount: [0, 50]
}

//types

export type CardPacksType = {
    _id?: string
    user_id?: string
    user_name?: string
    private?: boolean
    name: string
    path?: string
    grade?: number
    shots?: number
    cardsCount?: number | undefined
    type?: string
    rating?: number
    created?: string | undefined
    updated?: string
    more_id?: string
    __v?: number
}

//actions
export const setCardsPacksAC = (setPack: CardPacksType[]) => ({type: 'pack/SET-PACKS', setPack} as const)
export const setTotalCardPacksCount = (totalCardPacksCount: number) => ({
    type: "pack/SET_TOTAL_CARD_PACKS_COUNT",
    totalCardPacksCount
} as const)
export const setCurrentPage = (page: number) => ({type: "pack/SET_CURRENT_PAGE", page} as const)
export const removePack = (packId: string) => ({type: "pack/REMOVE_PACK", packId} as const)
export const addPack = (cardPack: CardPacksType) => ({type: "pack/ADD_PACK", cardPack} as const)
export const setPacksSort = (sort: string | undefined) => ({type: "pack/SET_PACKS_SORT", sort} as const)
export const setIsPrivat = (isPrivat: boolean) => ({type: "pack/SET_IS_PRIVAT", isPrivat} as const)
export const setPackName = (packName: string | undefined) => ({type: "pack/SET_PACK_NAME", packName} as const)
export const setCheckedCount = (count: Array<number> | number) => ({type: "pack/SET_COUNT_RANGE", payload: count} as const)
export const setCardsCount = (min: number, max: number) => ({type: "pack/SET_CARDS_COUNT", min, max} as const)

type ActionPacksType =
    | ActionLoginType
    | ReturnType<typeof setCardsPacksAC>
    | ReturnType<typeof setErrorAC>
    | ReturnType<typeof setTotalCardPacksCount>
    | ReturnType<typeof setCurrentPage>
    | ReturnType<typeof removePack>
    | ReturnType<typeof addPack>
    | ReturnType<typeof setPacksSort>
    | ReturnType<typeof setIsPrivat>
    | ReturnType<typeof setPackName>
    | ReturnType<typeof setCheckedCount>
    | ReturnType<typeof setCardsCount>

type ThunkPacksType = ThunkAction<void, AppRootStateType, unknown, ActionPacksType>

//reducer
export const cardPackReducer = (state: CardsPackInitialStateType = initialState, action: ActionPacksType): CardsPackInitialStateType => {
    switch (action.type) {
        case "pack/SET-PACKS":
            return {...state, cardsPack: action.setPack}

        case "pack/SET_TOTAL_CARD_PACKS_COUNT":
            return {
                ...state, cardPacksTotalCount: action.totalCardPacksCount
            }
        case "pack/SET_CURRENT_PAGE":
            return {
                ...state, currentPage: action.page
            }
        case "pack/REMOVE_PACK":
            return {
                ...state,
                cardsPack: state.cardsPack.filter(pack => pack._id !== action.packId)
            }
        case "pack/ADD_PACK":
            return {
                ...state,
                cardsPack: [action.cardPack, ...state.cardsPack]
            }
        case "pack/SET_PACKS_SORT":
            return {
                ...state,
                sort: action.sort
            }
        case "pack/SET_IS_PRIVAT":
            return {
                ...state,
                isPrivat: action.isPrivat
            }
        case "pack/SET_PACK_NAME":
            return {
                ...state,
                packName: action.packName
            }
        case "pack/SET_COUNT_RANGE":
            return {
                ...state,
                checkedCount: action.payload
            }
        case "pack/SET_CARDS_COUNT":
            return {
                ...state,
                minCardsCount: action.min,
                maxCardsCount: action.max
            }
        default:
            return state
    }
}
//thunks
export const getPacks = (page: number | undefined, pageCount: number | undefined, userId?: string): ThunkPacksType => async (dispatch, getState) => {
    const sort = getState().packs.sort
    const packName = getState().packs.packName
    // @ts-ignore
    const min = getState().packs.checkedCount[0]
    // @ts-ignore
    const max = getState().packs.checkedCount[1]

    dispatch(setIsFetchingAC(true));
    try {
        const res = await cardsPackAPI.getPacks(page, pageCount, sort, userId, packName, min, max)
        dispatch(setCardsPacksAC(res.data.cardPacks))
        dispatch(setTotalCardPacksCount(res.data.cardPacksTotalCount))
        dispatch(setCardsCount(res.data.minCardsCount, res.data.maxCardsCount))
    } catch (e) {
        const error = e.response
            ? e.response.data.error
            : (e.message + ', more details in the console');
        dispatch(setErrorAC(error))
        console.log('Error: ', {...e})
        return console.log(error)
    } finally {
        dispatch(setIsFetchingAC(false));
    }
};


export const createNewPack = (cardPack: CardPacksType): ThunkPacksType => async (dispatch, getState) => {
    const page = getState().packs.currentPage
    const pageCount = getState().packs.pageSize
    const isPrivat = getState().packs.isPrivat
    const userId = getState().profile.profile._id

    try {
        dispatch(setIsFetchingAC(true));
        await cardsPackAPI.createPack(cardPack)
        dispatch(addPack(cardPack))
        if (isPrivat) {
            dispatch(getPacks(page, pageCount, userId))
        } else {
            dispatch(getPacks(page, pageCount, ""))
        }
        // dispatch(setCurrentPage(1))
    } catch (e) {
        const error = e.response
            ? e.response.data.error
            : (e.message + ', more details in the console');
        console.log('Error: ', {...e})
        dispatch(setErrorAC(error))
        return console.log(error)
    } finally {
        dispatch(setIsFetchingAC(false));
    }
}

export const deleteCardPack = (id: string): ThunkPacksType => async (dispatch, getState) => {
    const page = getState().packs.currentPage
    const pageCount = getState().packs.pageSize
    const isPrivat = getState().packs.isPrivat
    const userId = getState().profile.profile._id

    dispatch(setIsFetchingAC(true))
    try {
        await cardsPackAPI.deletePack(id)
        dispatch(removePack(id))
        if (isPrivat) {
            dispatch(getPacks(page, pageCount, userId))
        } else {
            dispatch(getPacks(page, pageCount, ""))
        }
    } catch (e) {
        const error = e.response
            ? e.response.data.error
            : (e.message + ', more details in the console');
        console.log('Error: ', {...e})
        dispatch(setErrorAC(error))
        return console.log(error)
    } finally {
        dispatch(setIsFetchingAC(false));
    }
}

export const updateCardPack = (cardPack: CardPacksType): ThunkPacksType => async (dispatch, getState) => {
    const page = getState().packs.currentPage
    const pageCount = getState().packs.pageSize
    const isPrivat = getState().packs.isPrivat
    const userId = getState().profile.profile._id
    try {
        dispatch(setIsFetchingAC(true));
        await cardsPackAPI.updatePack(cardPack)
        if (isPrivat) {
            dispatch(getPacks(page, pageCount, userId))
        } else {
            dispatch(getPacks(page, pageCount, ""))
        }
        dispatch(setCurrentPage(1))
    } catch (e) {
        const error = e.response
            ? e.response.data.error
            : (e.message + ', more details in the console');
        console.log('Error: ', {...e})
        dispatch(setErrorAC(error))
        return console.log(error)
    } finally {
        dispatch(setIsFetchingAC(false));
    }
}








