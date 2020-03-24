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


const Editor = (props) => {
    // state
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
        setLecture(lecture_);
    }

    const delSect = (i) => {
        let lecture_ = lecture.slice();
        lecture_.splice(i, 1);
        setLecture(lecture_);
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
                    {lecture.map((sect, id) => {
                        return <div className='lecture-sect' key={id}>
                            {!sect.render? <TextareaAutosize
                                className='sect'
                                defaultValue={sect.content}
                                onChange={(e) => handleSectChange(id, e)}
                                onBlur={_ => viewHideRenderedSect(id)}
                            >
                            </TextareaAutosize>
                            :<div className='sect-rendered'
                                onDoubleClick={_ => viewHideRenderedSect(id)}>
                                <MdRender 
                                    source={sect.content} 
                                />
                            </div>}
                            <Button 
                                className='del-sect'
                                onClick={_ => delSect(id)}
                            >
                                <CloseRoundedIcon/>
                            </Button>
                        </div>
                    })}
                    <Button
                        className='add-new-sect' 
                        onClick={addNewSect}
                    >
                        <ControlPointTwoToneIcon/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Editor;