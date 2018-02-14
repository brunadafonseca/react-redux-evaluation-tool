import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { AddStudentForm } from './AddStudentForm'
import StudentItem from './StudentItem'
import EditBatch from '../components/forms/EditBatch'
import { createStudent } from '../actions/students/create'
import { updateStudent } from '../actions/students/update'
import { fetchBatchById } from '../actions/batches/fetch'
import {updateBatch} from '../actions/batches/update'
import {deleteBatch} from '../actions/batches/delete'
import './BatchPage.css'

//material-ui
import Paper from 'material-ui/Paper'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentCreate from 'material-ui/svg-icons/content/create'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ActionThumbUp from 'material-ui/svg-icons/action/thumb-up'
import ActionThumbDown from 'material-ui/svg-icons/action/thumb-down'
import ActionThumbsUpDown from 'material-ui/svg-icons/action/thumbs-up-down'

const customContentStyle = {
  width: '400px',
  maxWidth: '400px',
  fontSize: '2rem',
  textAlign: 'center'
}

export class BatchPage extends PureComponent {

  componentWillMount() {
    this.props.fetchBatchById(this.props.match.params.batchId)
  }

  state = {
    open: false,
    message: "Student created!",
    showConfirmation: false,
    viewStudent: false,
    studentName: "",
    showEditForm: false,
  }

  pickStudent = () => {
    const student = (this.getStudent())

    this.setState({
      studentName: student.name,
      viewStudent: true,
      studentEvaluations: student.evaluations,
      student: student
    })
  }

  submitEvaluation = (e) => {
    const evaluations = this.state.studentEvaluations
    const batchId = this.props.match.params.batchId

    const newEvaluation = {
      day: Date.now(),
      color: e.currentTarget.value,
      remark: ''
    }

    const allEvaluations = evaluations.filter(evaluation => {
      const evaluationDate = new Date(evaluation.day).toDateString()
      const newEvaluationDate = new Date(newEvaluation.day).toDateString()

      return ( evaluationDate !== newEvaluationDate )
    })

    const updatedStudent = {
      ...this.state.student,
      evaluations: [...allEvaluations, {...newEvaluation}]
    }

    this.props.updateStudent(batchId, updatedStudent)
    this.handleClose()
  }

  getStudent = () => {
    const randomNumber = Math.random()
    const codeRed = this.filterByColor('red')
    const codeGreen = this.filterByColor('green')
    const codeOrange = this.filterByColor('orange')

    if ( randomNumber <= 0.5 ) {
      if ( codeRed.length > 0 ) {
        return codeRed[Math.floor(Math.random()*codeRed.length)]
      } else {
        return this.getStudent()
      }
    }
    if ( randomNumber > 0.5 && randomNumber <= 0.8 ) {
      if ( codeOrange.length > 0 ) {
        return codeOrange[Math.floor(Math.random()*codeOrange.length)]
      } else {
        return this.getStudent()
      }
    }
    if ( randomNumber > 0.8 ) {
      if ( codeGreen.length > 0 ) {
      return codeGreen[Math.floor(Math.random()*codeGreen.length)]
    } else {
      return this.getStudent()
    }
    }
  }

  getLastEvaluation() {
    const batchPerformance = this.props.students.map(student => {
      return {...student, latestEvaluation: student.evaluations[student.evaluations.length-1]}
    })
    return batchPerformance
  }

  showPercentage(color) {
    const totalStudents = this.props.students.length
    const colorPercentage = this.filterByColor(color)

    return Math.round((colorPercentage.length / totalStudents) * 100)
  }

  filterByColor(color) {
    const batchPerformance = this.getLastEvaluation()
    const colorPercentage = batchPerformance.filter(student => student.latestEvaluation.color === color)

    return colorPercentage
  }

  renderStudents() {
    const students = this.props.students

    return students.map(student => <StudentItem batchId={this.props.selectedBatch._id}
                                                studentId={student._id}
                                                key={student._id}
                                                name={student.name}
                                                photo={student.photo}
                                                evaluations={student.evaluations} />)
  }

  editBatch = () => {
    const batch = this.props.selectedBatch
    const id = batch._id
    const updates = {
      number: this.state.number,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    }

    const updatedBatch = {
      ...batch,
      updates
    }

    console.log(updatedBatch)
    // this.props.updateBatch(id)
  }

  deleteBatch = () => {
    const batchId = this.props.selectedBatch._id

    this.props.deleteBatch(batchId)
    this.handleClose()
  }

  handleOpen = () => {
    this.setState({open: true})
  }

  openConfirmation = () => {
    this.setState({showConfirmation: true})
  }

  openEditForm = () => {
    this.setState({showEditForm: true})
  }

  handleClose = () => {
    this.setState({
      open: false,
      showConfirmation: false,
      viewStudent: false,
      showEditForm: false,
    })
  }

  renderButton = (color) => {
    return (
      <button className={`${color} ${this.state.color === `${color}` ? `active` : null}`}
              value={color}
              onClick={this.submitEvaluation}>

              {(color === 'green') ? <ActionThumbUp style={{ color: '#fff' }} /> : null}
              {(color === 'orange') ? <ActionThumbsUpDown style={{ color: '#fff' }} /> : null}
              {(color === 'red') ? <ActionThumbDown style={{ color: '#fff' }} /> : null}
      </button>
    )
  }

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Discard"
        primary={true}
        onClick={this.deleteBatch}
      />
    ]

    if (!this.props.students || !this.props.selectedBatch) return null

    const { number, startDate, endDate } = this.props.selectedBatch

    const greenPercentage = this.showPercentage('green')
    const orangePercentage = this.showPercentage('orange')
    const redPercentage = this.showPercentage('red')

    return (
      <div className="batch-container">
        <Paper className="batch-card">
          <div className="batch-info">
            <h1>Class #{ number }</h1>

            <div className="batch-dates">
              <p>Start date: { new Date(startDate).toDateString() }</p>
              <p>End date: { new Date(endDate).toDateString() }</p>
            </div>
          </div>

          <div className="edit-buttons">
            <FloatingActionButton secondary={true} onClick={this.openEditForm}>
              <ContentCreate />
            </FloatingActionButton>
            <Dialog
              title="Edit batch:"
              modal={false}
              contentStyle={customContentStyle}
              open={this.state.showEditForm}
              onRequestClose={this.handleClose}
            >
              <EditBatch {...this.props.selectedBatch} handleClose={this.handleClose} /> }
            </Dialog>

            <FloatingActionButton onClick={this.openConfirmation} secondary={true}>
              <ActionDelete />
            </FloatingActionButton>

            <Dialog
              actions={actions}
              contentStyle={customContentStyle}
              modal={false}
              open={this.state.showConfirmation}
              onRequestClose={this.handleClose}
            >
              Are you sure you want to delete this batch?
            </Dialog>

            <FloatingActionButton onClick={this.handleOpen} secondary={true}>
              <ContentAdd />
            </FloatingActionButton>

            <Dialog
              title="Add new student"
              modal={false}
              contentStyle={customContentStyle}
              open={this.state.open}
              onRequestClose={this.handleClose}
            >
              <AddStudentForm
                handleClose={this.handleClose}
                createStudent={this.props.createStudent}
                batchId={this.props.match.params.batchId}
              />
            </Dialog>
          </div>
        </Paper>

        { (this.props.students.length > 0) &&
          <div>
            <div className="batch-performance">
              {greenPercentage > 0 && <div className='green-bar' style={{ width: `${greenPercentage}%`}}>{ `${greenPercentage}%` || null }</div>}
              {orangePercentage > 0 && <div className='orange-bar'style={{ width: `${orangePercentage}%`}}>{ `${orangePercentage}%` || null }</div>}
              {redPercentage > 0 && <div className='red-bar'style={{ width: `${redPercentage}%`}}>{ `${redPercentage}%` || null }</div>}
            </div>

            <div className="header">
              <h1 className="batches-header">Students: </h1>

              <div className="random-student">
                <RaisedButton label="Random student" onClick={this.pickStudent} secondary={true} />
                <Dialog
                  contentStyle={customContentStyle}
                  modal={false}
                  open={this.state.viewStudent}
                  onRequestClose={this.handleClose}
                >
                  {this.state.studentName}

                  <div className="evaluation-btns">
                    {this.renderButton('green')}
                    {this.renderButton('orange')}
                    {this.renderButton('red')}
                  </div>
                </Dialog>
              </div>
            </div>

            <div className="students-list">
              {this.renderStudents()}
            </div>
          </div> }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  selectedBatch: state.batches.selectedBatch,
  students: state.batches.selectedBatch.students
})

export default connect(mapStateToProps, { fetchBatchById, createStudent, updateStudent, updateBatch, deleteBatch })(BatchPage)
