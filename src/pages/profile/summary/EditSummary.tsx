import { useState } from 'react';
import { Button, TextArea, Modal, Form } from 'semantic-ui-react'
import axios from 'axios';
import './EditSummary.css';

interface Props {
  userId: string;
  summary: string;
  isShow: boolean;
  handleCloseModal();
}

function EditSummary(props: Props) {

  let [form, setForm] = useState({
    text: props.summary,
    isShow: false,
    isError: false,
    isLoading: false,
  });

  let onChangeText = (e) => {
    setForm({ ...form, text: e.target.value });
  };

  let handleEditText = () => {
    setForm({ ...form, isError: false, isLoading: true });
    if (!form.text || form.text === '' || form.text.length === 0) {
      setForm({ ...form, isError: true, isLoading: false });
    }
    else {
      let reqData = {
        userId: props.userId,
        summary: form.text,
      }
      axios.post(`/user/edit-summary`, reqData)
        .then(res => {
          setForm({ ...form, isLoading: false });
          props.handleCloseModal();
        })
        .catch(err => {
          setForm({ ...form, isError: true, isLoading: false });
          console.log(err);
        })
    }
  };

  return (
    <Modal
      open={props.isShow}
      onClose={props.handleCloseModal}
      className='edit-summary-modal'>
      <span className="edit-summary-heading-text">
        Edit Summary
      </span>
      <div className="edit-summary-modal content">
        <div className="description">
          <Form loading={form.isLoading}>
            <Form.Field error={form.isError}>
              <TextArea
                rows={5}
                value={form.text}
                onChange={(e) => onChangeText(e)} />
            </Form.Field>
          </Form>
        </div>
      </div>
      <Button
        loading={form.isLoading}
        className='edit-summary-submit-button'
        type='submit'
        onClick={() => handleEditText()}>
        Submit
      </Button>
    </Modal>
  )
}

export default EditSummary;