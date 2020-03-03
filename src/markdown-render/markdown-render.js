import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from '../syntax-highlight/syntax-highlight';
import './_markdown-render.scss';
import RemarkMathPlugin from 'remark-math';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import Button from '@material-ui/core/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';


class MdRender extends Component{
    state = {
        escapeHtml: false, // enable html rendering
        plugins: [
            RemarkMathPlugin,
        ],
        renderers: {
            ...this.props.renderers,
            code: CodeBlock,
            math: (props) => 
                <BlockMath math={props.value} />,
            inlineMath: (props) =>
                <InlineMath math={props.value} />,
            link: (props) => {
                if (props.href.startsWith('https://docs.google.com/presentation')) {
                    return <span className='gg-slides'>
                        <iframe src={props.href} />
                        <Button variant='outlined' className='full-screen' href={props.href} target='_blank'>
                            <Icon iconName='OpenInNewTab' /> Open
                        </Button>
                    </span>;
                }
                return <a href={props.href} target='_blank'>{props.children[0].props.value}</a>;
            }
        },
    };

    render() {
        console.log('oofi');
        return (
            <div className='markdown-render'>
                <ReactMarkdown {...this.props} {...this.state}/>
            </div> 
        );
    }
}
// this is new
export default MdRender;