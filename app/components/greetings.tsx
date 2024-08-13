 
export default function Greetings({image , name} :{
    image : string,
    name : string
}) {
    return <div className="flex">
        <img src={image}  className="rounded-full w-12 h-12 m-2" />
        <div className="p-3 text-3xl font-bold">Welcome back {name}</div>
    </div>
}