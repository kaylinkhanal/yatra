import React, {useEffect} from 'react'
import { useRouter } from 'next/router'
function index() {
    const router = useRouter()
    const {id} = router.query
    return (
        <div>
            hi i am  {id}
        </div>
    )
}

export default index
