import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up'
import ActionThumbDown from 'material-ui/svg-icons/action/thumb-down'
import ActionThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down'
import { updateEvaluation } from '../actions/batches/update'
import { Link } from 'react-router-dom'

import './Student.css'

class StudentItem extends PureComponent {

  handleClick = (e) => {
    const color = e.currentTarget.getAttribute('data-id')
    const day = (new Date).toDateString()
    const newEvaluation = {
      day: day,
      color: color
    }
    const batchId = this.props.batches[0]._id
    const studentId = this.props._id
    const student = this.props
    const updatedStudent = {...student, evaluations: [newEvaluation] }

    this.props.updateEvaluation(batchId, {updatedStudent} )
  }

  render() {
    console.log(this.props)
    const { name, photo, _id, batches } = this.props
    const batchId = batches[0]._id

    return (
        <div className="student">
          <Link to={ `/batches/${batchId}/students/${_id}` }>
            <p>{name}</p>
            <img src={photo} />
          </Link>
          <div className="evaluation-btns">
            <FloatingActionButton
              data-id="green"
              className="green-btn"
              onClick={this.handleClick.bind(this)}
              backgroundColor="#00B749">
              <ActionThumbUp />
            </FloatingActionButton>
            <FloatingActionButton
              data-id="orange"
              className="orange-btn"
              onClick={this.handleClick.bind(this)}
              backgroundColor="#FFBA08">
              <ActionThumbsUpDown />
            </FloatingActionButton>
            <FloatingActionButton
              data-id="red"
              className="red-btn"
              onClick={this.handleClick.bind(this)}
              backgroundColor="#D00000">
              <ActionThumbDown />
            </FloatingActionButton>
          </div>
      </div>
    )
  }
}

const mapStateToProps = ({ batches }) => ({ batches })

export default connect(mapStateToProps, { updateEvaluation })(StudentItem)