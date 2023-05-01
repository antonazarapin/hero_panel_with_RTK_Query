import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup"
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from "react-redux";

import { useDispatch } from 'react-redux';
import {selectAll} from "../heroesFilters/filtersSlice";
import { useAddHeroMutation } from "../../api/apiSlice";

const HeroesAddForm = () => {
    const {filtersLoadingStatus} = useSelector(state => state.filters)
    const filters = useSelector(selectAll);

    const [addHero] = useAddHeroMutation();

    const renderOptions = (filters, status) => {
        if (status === 'loading') {
            return <option>Загрузка</option>
        } else if (status === 'error') {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0) {
            return filters.map(({name, label}) => {
                if (name === 'all') return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <Formik
            initialValues = {{
                name: '',
                description: '',
                element: ''
            }}
            validationSchema = {Yup.object({
                name: Yup.string()
                            .min(2, 'Минимум 2 символа')
                            .required('*Обязательное поле'),
                description: Yup.string()
                            .min(10, 'Не менее 10 символов')
                            .required('*Обязательное поле'),
                element: Yup.string().required('*Выберите элемент героя'),
            })}
            onSubmit = {(values, {resetForm}) => {
                const newHero = {
                    id: uuidv4(),
                    name: values.name,
                    description: values.description,
                    element: values.element
                }

                addHero(newHero).unwrap();
                resetForm();
            }}>


            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field 
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" 
                        placeholder="Как меня зовут?"
                        />

                    <ErrorMessage name="name" style={{color: 'red', paddingLeft: '7px'}} component="div"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field
                        name="description" 
                        className="form-control" 
                        id="description" 
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}/>

                    <ErrorMessage name="description" style={{color: 'red', paddingLeft: '7px'}} component="div"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field 
                        required
                        className="form-select" 
                        id="element" 
                        name="element"
                        as='select'>
                        <option >Я владею элементом...</option>
                        {renderOptions(filters, filtersLoadingStatus)}
                    </Field>

                    <ErrorMessage name="element" style={{color: 'red', paddingLeft: '7px'}} component="div"/>
                </div>

                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}

export default HeroesAddForm;