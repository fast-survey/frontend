
import React from 'react';
import {ReduxStore} from '../../../utilities/reduxTypes';
import {connect} from 'react-redux';
import assert from 'assert';
import {FormDataInterface, SelectionFieldConfig} from '../../../utilities/fieldTypes';
import {modifyData} from '../../../utilities/reduxActions';
import CheckboxOption from '../../../Components/CheckboxOption';

interface SelectionFieldComponentProps {
    formData: any;
    fieldIndex: number;
    fieldConfig: SelectionFieldConfig;
    modifyData(formData: any): any;
}

function SelectionFieldComponent(props: SelectionFieldComponentProps) {

    assert(props.formData !== undefined);

    function handleChange(optionIndex: number, newChecked: boolean) {
        const newFormData: any = JSON.parse(JSON.stringify(props.formData));
        newFormData[(props.fieldIndex + 1).toString()][(optionIndex + 1).toString()] = newChecked;
        props.modifyData(newFormData);
    }

    return (
        <div className='display-block'>
            <h4>{props.fieldConfig.title}</h4>
            {props.fieldConfig.properties.fields.map((optionField, optionIndex) => (
                <CheckboxOption
                    key={optionIndex}
                    label={optionField.title}
                    checked={props.formData
                        [(props.fieldIndex + 1).toString()]
                        [(optionIndex + 1).toString()]
                    }
                    onChange={newChecked => handleChange(optionIndex, newChecked)}
                />
            ))}
        </div>
    );
}

const mapStateToProps = (state: ReduxStore) => ({
    formData: state.formData,
});

const mapDispatchToProps = (dispatch: any) => ({
    modifyData: (formData: FormDataInterface) => dispatch(modifyData(formData)),
});

const SelectionField = connect(mapStateToProps, mapDispatchToProps)(SelectionFieldComponent);

export default SelectionField;