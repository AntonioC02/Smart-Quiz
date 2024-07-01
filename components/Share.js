import Button from './Button';
import QRCode from 'qrcode.react';

export default function Share({ onClickClose, Quiz }) {
    const link = (Quiz != undefined) ? `localhost:3000/Quiz/${Quiz.id}` : 'null';

    return (
        <div className="bg-red-600 text-white p-6 rounded-lg my-4 w-fit flex flex-col items-center">
            <div className="flex w-full justify-between pb-4">
                <h2 className="text-2xl">Share</h2>
                <Button text="x" onClick={onClickClose} />
            </div>
                <h2 className="text-xl mx-16 mb-4">{Quiz.title}</h2>
            <div className='bg-white border-2 border-red-800 p-4'>
                <QRCode value={link} />
            </div>
            <h2 className='bg-white border-2 border-red-800 text-black my-4 p-2'>{link}</h2>
        </div>
    );
}
