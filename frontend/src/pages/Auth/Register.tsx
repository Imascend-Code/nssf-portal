// src/pages/Auth/Register.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../../api/hooks";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const { mutateAsync, isPending } = useRegister();
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(async (values) => {
      await mutateAsync(values);
      nav("/dashboard", { replace: true });
    })} className="max-w-md mx-auto space-y-3 p-6 border rounded-lg mt-8">
      <h1 className="text-xl font-semibold">Create account</h1>
      <div>
        <label className="block text-sm mb-1">Full name</label>
        <input {...register("full_name")} className="border rounded w-full p-2" />
        {errors.full_name && <p className="text-red-600 text-sm">{errors.full_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Phone</label>
        <input {...register("phone")} className="border rounded w-full p-2" />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input {...register("email")} className="border rounded w-full p-2" />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input type="password" {...register("password")} className="border rounded w-full p-2" />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
      </div>
      <button disabled={isPending} className="border rounded px-3 py-2">
        {isPending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
