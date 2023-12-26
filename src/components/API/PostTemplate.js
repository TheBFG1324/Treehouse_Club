
import { useState } from "react"


function GeneratePost(props){

    const account = "tim"
    const coverPhoto = 'dec.jpeg';
    const data = 'OdeToYes.pdf';
    const date = "10/20/2023"
    const likes = 16
    const comments = {
        sally: "hello",
        Jazz: "Good post tim"
    }

    const [showPDF, setShowPDF] = useState(false)

    const handleCoverPhotoClick = () => {
        setShowPDF(true);
      };

    return (
        <div className="Post">
            <div className="PostHeader">
                <span>{account} {date}</span>
            </div>
            {!showPDF && (<div className="CoverPhoto" onClick={handleCoverPhotoClick}>
                <img src={coverPhoto} alt="Cover Photo"></img>
            </div>)}
            {showPDF && (<div className="PostData">
                <embed src={data} type="application/pdf" width="100%" height="500px" />
            </div>)}
            <div className="Interactions">
                <p>Likes: {likes}</p>
                {Object.entries(comments).map(([name1, comment]) => (
                    <div key={name1}>
                        <strong>{name1}:</strong> {comment}
                    </div>
                ))}
            </div>

        </div>
    )
  
}

export default GeneratePost