import React from 'react';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
// import { ImageUtils } from 'braft-finder'
import 'braft-editor/dist/index.css';
import { Upload } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import OSS from 'ali-oss';

export default class UploadDemo extends React.Component {
	constructor(props) {
		super(props);
		const { infoData } = this.props;
		this.state = {
			editorState: BraftEditor.createEditorState(infoData),
		};
	}

	handleChange = editorState => {
		this.setState({ editorState });
		this.props.setFieldsValue({ info: editorState.toHTML() });
	};

	UNSAFE_componentWillReceiveProps( a, b ){
		const initNull = this.state.editorState.toHTML();
		if( a.infoData !== this.props.infoData && initNull==="<p></p>"){ // 编辑进来的
			this.setState({
				editorState:BraftEditor.createEditorState(a.infoData)
			})
		}

	}

	// eslint-disable-next-line consistent-return
	getUrl = async file => {
		const { ossTokencurrent } = this.props;
		
		if (ossTokencurrent && JSON.stringify(ossTokencurrent) !== '{}') {
			if (ossTokencurrent.expiration > Date.now()) {
				// 没有过期
				const client = new OSS({
					region: ossTokencurrent.region,
					accessKeyId: ossTokencurrent.accesKeyId, //
					accessKeySecret: ossTokencurrent.accesKeySecret, //
					stsToken: ossTokencurrent.securityToken, //
					bucket: ossTokencurrent.bucket, //
				});
				const rl = await client.put(`/ptd/washService${Date.now()}`, file);
				if (rl) {
					return rl.url;
				}
				// }
			}
		}
	};

	uploadHandler = async param => {
		if (!param.file) {
			return false;
		}

		const tempState = this.state.editorState;
		const url = await this.getUrl(param.file);
		this.setState(
			{
				editorState: ContentUtils.insertMedias(tempState, [
					{
						type: 'IMAGE',
						url,
					},
				]),
			},
			() => {
				this.props.setFieldsValue({ info: this.state.editorState.toHTML() });
			},
		);
		return false;
	};

	render() {
		const controls = [
			'bold',
			'italic',
			'underline',
			'text-color',
			'separator',
			'link',
			'separator',
		];
		const extendControls = [
			{
				key: 'antd-uploader',
				type: 'component',
				component: (
					<Upload accept="image/*" showUploadList={false} customRequest={this.uploadHandler}>
						{/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
						<button
							type="button"
							className="control-item button upload-button"
							data-title="插入图片"
						>
							<PictureOutlined />
						</button>
					</Upload>
				),
			},
		];
		const { height="300", infoData}=this.props;
		return (
			<div className="editor-wrapper">
				<BraftEditor
					readOnly={this.props.disabled}
				 	style={{height}}
					value={this.state.editorState}
					// defaultValue={BraftEditor.createEditorState(infoData)}
					onChange={this.handleChange}
					controls={controls}
					extendControls={extendControls}
				/>
			</div>
		);
	}
}
