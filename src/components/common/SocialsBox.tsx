import styles from './common.module.scss'
import linkedin from '../../images/linkedin-color.png'
import netlight from '../../images/netlight-color.png'
import instagram from '../../images/instagram-color.png'
import snapchat from '../../images/snapchat-color.png'
import React from 'react'

export default function SocialsBox() {
    return (
        <div className={styles.socialsBox}>
            <img
                src={linkedin}
                alt={'linkedin logo color'}
                onClick={() =>
                    (window.location.href =
                        'https://no.linkedin.com/in/henrik-klev-5b5938192')
                }
            />
            <img
                src={netlight}
                alt={'netlight logo color'}
                onClick={() =>
                    (window.location.href = 'https://www.netlight.com/')
                }
            />
            <img
                src={instagram}
                alt={'instagram logo color'}
                onClick={() =>
                    (window.location.href =
                        'https://www.instagram.com/henrik_klev/')
                }
            />
            <img
                src={snapchat}
                alt={'snapchat logo color'}
                onClick={() =>
                    (window.location.href =
                        'https://www.snapchat.com/add/henklev?share_id=RDgwQjQ4QjQtNkUxMC00RTQyLTg2QTktMjEzQUY0NDQ2NjQ3&locale=nb_NO&fbclid=IwAR31A4EXuL0IDQEP05bD0-r1uzZ2Wt6DbpwWgzmNkdfnc7f8UPnOKN07iB0')
                }
            />
        </div>
    )
}
