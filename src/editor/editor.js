// react imports
import React, { Component, useState } from 'react';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

// import style file
import './_editor.scss';

// import other cpns
import MdRender from '../markdown-render/markdown-render';

// third party imports
import Button from '@material-ui/core/Button';
import ControlPointTwoToneIcon from '@material-ui/icons/ControlPointTwoTone';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import SaveTwoToneIcon from '@material-ui/icons/SaveTwoTone';
import { v4 as uuidv4 } from 'uuid';

const LectureSect = (props) => {
    return <div className='lecture-sect'>
        {!props.sect.render? <TextareaAutosize
            className='sect'
            defaultValue={props.sect.content}
            onChange={props.handleChange}
            onBlur={props.viewHide}
        >
        </TextareaAutosize>
        :<div className='sect-rendered'
            onDoubleClick={props.viewHide}>
            <MdRender 
                source={props.sect.content} 
            />
        </div>}
        <Button 
            className='del-sect'
            onClick={props.del}
        >
            <CloseRoundedIcon/>
        </Button>
    </div>
}

const Editor = (props) => {
    // state
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [lecture, setLecture] = useState([]);
    const [slides, setSlides] = useState([]);
    const [dwLinks, setDwLinks] = useState([]);

    // methods
    const addNewSect = () => {
        let lecture_ = lecture.slice();
        lecture_.push({content: '', render: false});
        setLecture(lecture_);
    }

    const handleSectChange = (i, e) => {
        let lecture_ = lecture.slice();
        lecture_[i].content = e.target.value;
        setLecture(lecture_);
    }

    const viewHideRenderedSect = (i) => {
        let lecture_ = lecture.slice();
        lecture_[i].render = !lecture_[i].render;
        // trim white spaces when escaping edit mode
        if (!lecture_[i].render) {
            lecture_[i].content = lecture_[i].content.trim();
        }
        setLecture(lecture_);
    }

    const delSect = (i) => {
        let lecture_ = lecture.slice();
        lecture_.splice(i, 1);
        setLecture(lecture_);
    }

    const saveToCloud = () => {
        let idx = uuidv4();
        setId(idx);
        console.log(`uuid: ${idx}`);
    }

    // render
    return (
        <div className='editor'>
            <div className='lecture-container'>
                <TextareaAutosize 
                    className='title-fill'
                    placeholder='Enter title here'>
                </TextareaAutosize>
                <TextareaAutosize 
                    className='desc-fill'
                    placeholder='Enter description here'>
                </TextareaAutosize>
                <div className='lecture'>
                    {lecture.map((sect, id) => <LectureSect key={id}
                            handleChange={(e) => handleSectChange(id, e)}
                            viewHide={_ => viewHideRenderedSect(id)}
                            sect={sect}
                            del={_ => delSect(id)}
                        />
                    )}
                    <Button
                        className='add-new-sect' 
                        onClick={addNewSect}
                    >
                        <ControlPointTwoToneIcon/>
                    </Button>
                </div>
            </div>
            <div className='validate'>
                <Button 
                    onClick={saveToCloud} 
                    variant='contained'
                    startIcon={<SaveTwoToneIcon/>}>Save Lecture
                </Button>
            </div>
        </div>
    )
}

export default Editor;