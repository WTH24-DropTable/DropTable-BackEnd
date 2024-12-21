//facial recognition
const run = async()=>{
    //we need to load our models
    //loading the models is going to use await
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.ageGenderNet.loadFromUri('./models'),
    ])

    // Array of reference faces with their names
    const referenceFaces = [
        { name: "Hervin", imagePath: './images/Hervin.jpg' },
        { name: "Ethan", imagePath: './images/Ethan.png' },
    ]

    // Load and process each reference face
    const labeledFaceDescriptors = await Promise.all(
        referenceFaces.map(async refFace => {
            const img = await faceapi.fetchImage(refFace.imagePath)
            const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors()
            return new faceapi.LabeledFaceDescriptors(refFace.name, detections.map(d => d.descriptor))
        })
    )

    const facesToCheck = document.getElementById('facesToCheck')
    let facesToCheckAiData = await faceapi.detectAllFaces(facesToCheck).withFaceLandmarks().withFaceDescriptors()

    //get the canvas, and set it on top of the image and make it the same size as checking image
    const canvas = document.getElementById('canvas')
    faceapi.matchDimensions(canvas,facesToCheck)

    // Create a face matcher with the labeled face descriptors
    let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)
    facesToCheckAiData = faceapi.resizeResults(facesToCheckAiData,facesToCheck)

    //loop through all of the faces in our imageToCheck and compare to our reference data
    facesToCheckAiData.forEach(face=>{
        const { detection, descriptor } = face
        //make a label, using the default
        let label = faceMatcher.findBestMatch(descriptor).toString()
        console.log(label)
        if(label.includes("unknown")){
            return
        }
        let options = { label: label }
        const drawBox = new faceapi.draw.DrawBox(detection.box,options)
        drawBox.draw(canvas)
    })

}   

run()