import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {CardsType, getCardsByPackId} from "../../../m2-bll/redusers/cards-reducer";
import {AppRootStateType} from "../../../m2-bll/state/store";

const grades = ['не знал', 'забыл', 'долго думал', 'перепутал', 'знал'];

const getCard = (cards: CardsType[]) => {
    const sum = cards.reduce((acc, card) => acc + (6 - card.grade) * (6 - card.grade), 0);
    const rand = Math.random() * sum;
    const res = cards.reduce((acc: { sum: number, id: number}, card, i) => {
            const newSum = acc.sum + (6 - card.grade) * (6 - card.grade);
            return {sum: newSum, id: newSum < rand ? i : acc.id}
        }
        , {sum: 0, id: -1});
    console.log('test: ', sum, rand, res)

    return cards[res.id + 1];
}

export const Learn = () => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [first, setFirst] = useState<boolean>(true);
    // const [first, setFirst] = useState<boolean>(0);
    const cards = useSelector<AppRootStateType, Array<CardsType>>(state => state.cards.cards);
    const {id} = useParams<{ id: string }>();

    const [card, setCard] = useState<CardsType>({
        _id: 'fake',
        cardsPack_id: '',

        answer: 'answer fake',
        question: 'question fake',
        grade: 0,
        shots: 0,

        type: '',
        rating: 0,
        more_id: '',

        created: '',
        updated: '',
    });

    const dispatch = useDispatch();
    useEffect(() => {
        console.log('LearnContainer useEffect');

        if (first) {
            dispatch(getCardsByPackId(id));
            setFirst(false);
        }

        console.log('cards', cards)
        if (cards.length > 0) setCard(getCard(cards));

        return () => {
            console.log('LearnContainer useEffect off');
        }
    }, [dispatch, id, cards, first]);

    const onNext = () => {
        setIsChecked(false);

        if (cards.length > 0) {
            // dispatch
            setCard(getCard(cards));
        } else {

        }
    }

    return (
        <div>
            LearnPage

            <div>{card.question}</div>
            <div>
                <button onClick={() => setIsChecked(true)}>check</button>
            </div>

            {isChecked && (
                <>
                    <div>{card.answer}</div>

                    {grades.map((g, i) => (
                        <button key={'grade-' + i} onClick={() => {
                        }}>{g}</button>
                    ))}

                    <div><button onClick={onNext}>next</button></div>
                </>
            )}
        </div>
    );
};