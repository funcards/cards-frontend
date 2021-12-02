import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog } from '@reach/dialog'

import * as classes from './AddBoardPage.module.scss'

const AddBoardPage: React.FC = () => {
  const navigate = useNavigate()

  const onDismiss = () => navigate(-1)

  return (
    <Dialog aria-labelledby="add-board" onDismiss={onDismiss} className={classes.addBoard}>
      <p>Hello there. I am a dialog</p>
    </Dialog>
  )
}

export default AddBoardPage
