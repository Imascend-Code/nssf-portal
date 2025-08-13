import { useCategories, useCreateRequest, useUploadAttachment } from "../../api/hooks";
import { useState, FormEvent } from "react";

export default function NewRequest(){
  const cats = useCategories(); const create = useCreateRequest();
  const [createdId,setCreatedId]=useState<number|undefined>(); const [file,setFile]=useState<File|undefined>();
  const upload = useUploadAttachment(createdId || 0);
  if (cats.isLoading) return <p style={{padding:24}}>Loading...</p>
  async function onSubmit(e:FormEvent){ e.preventDefault(); const fd = new FormData(e.target as HTMLFormElement);
    const payload = { title:fd.get("title"), description:fd.get("description"), category: Number(fd.get("category")), priority: fd.get("priority") }
    const r = await create.mutateAsync(payload); setCreatedId(r.id);
    if (file) { const f = new FormData(); f.set("file", file); await upload.mutateAsync(f); }
  }
  return (
    <form onSubmit={onSubmit} style={{padding:24, display:"grid", gap:8, maxWidth:520}}>
      <h2>New Service Request</h2>
      <select name="category">{cats.data.results.map((c:any)=>(<option key={c.id} value={c.id}>{c.name}</option>))}</select>
      <input name="title" placeholder="Title" required/>
      <textarea name="description" placeholder="Describe your request" rows={5} required/>
      <select name="priority">
        <option value="normal">Normal</option><option value="low">Low</option><option value="high">High</option>
      </select>
      <input type="file" onChange={e=>setFile(e.target.files?.[0])}/>
      <button>Submit</button>
      {createdId && <p>Submitted with ID #{createdId}</p>}
    </form>
  )
}
