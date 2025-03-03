"use client";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import "react-phone-number-input/style.css";

import * as RPNInput from "react-phone-number-input";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LocationSelector from "@/components/ui/location-input";

import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { createBusinessDetails } from "@/app/actions/settingActions";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/app/store/useUserStore";

const formSchema = z.object({
  businame: z.string(),
  phone: z.string(),
  location: z.tuple([z.string(), z.string().optional()]),
  roadname: z.string(),
  postal: z.string(),
  logo: z.instanceof(File, { message: "Please select an image file" }),
});

export default function BusinessSetup() {
  const router = useRouter();
 
  const { user, setBusiness } = useUserStore();
 

  const id = useId();

  const [preview, setPreview] = useState<string | null>(null);
  const [countryName, setCountryName] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createBusinessDetails(values,user?.id as string);
      if (result?.status === "success") {
        toast.success(`Business setup completed`);
        setBusiness(result.data)
        form.reset();
        router.push("/");
      } else {
        form.setError("root.serverError", { message: result?.error as string });
        toast.error(`${result?.error}`);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <div className="flex flex-wrap gap-x-4">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="businame"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Business name"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your business name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <RPNInput.default
                        className="flex rounded-lg shadow-xs"
                        international
                        inputComponent={PhoneInput}
                        id={id}
                        placeholder="Enter phone number"
                        value={field.value}
                        onChange={(newValue) => {
                          if (newValue) {
                            form.setValue(field.name, newValue.toString());
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your business phone number , Starts with
                      country,area code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Country</FormLabel>
                <FormControl>
                  <LocationSelector
                    onCountryChange={(country) => {
                      setCountryName(country?.name || "");
                      form.setValue(field.name, [
                        country?.name || "",
                        stateName || "",
                      ]);
                    }}
                    onStateChange={(state) => {
                      setStateName(state?.name || "");
                      form.setValue(field.name, [
                        form.getValues(field.name)[0] || "",
                        state?.name || "",
                      ]);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  If your country has states, they will appear after selecting a
                  country.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="roadname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Road Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Road Name" type="text" {...field} />
                    </FormControl>
                    <FormDescription>This is your road name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="postal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Postal Code" type="text" {...field} />
                    </FormControl>
                    <FormDescription>This is your postal code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Image Upload Field */}
          <FormField
            control={form.control}
            name="logo"
            render={({ field: { onChange } }) => (
              <FormItem className="*:not-first:mt-2">
                <FormLabel>Upload Logo</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        onChange(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setPreview(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {preview && (
                      <div className="mt-4 ">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-48 rounded-2xl"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Select an image file for your business logo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}

const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn(
          "-ms-px rounded-s-none shadow-none focus-visible:z-10",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
