import Wrapper from "../assets/wrappers/DashboardFormPage";
import {
  Form,
  redirect,
  useNavigation,
  useOutletContext,
} from "react-router-dom";
import { FormRow, FormRowSelect, SubmitBtn } from "../components";
import { toast } from "react-toastify";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import customFetch from "../utils/customFetch";
import { QueryClient } from "@tanstack/react-query";

export const action =
  (QueryClient) =>
  async ({ request }) => {
    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);

      await customFetch.post("/jobs", data);
      QueryClient.invalidateQueries(["jobs", "stats"]);
      toast.success("Job added successfully");

      return redirect("/dashboard/all-jobs");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
    return null;
  };

const AddJobs = () => {
  const { user } = useOutletContext();
  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">Add Job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" />
          <FormRow type="text" name="company" />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={user.location}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            defaultValue={JOB_STATUS.PENDING}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            defaultValue={JOB_TYPE.FULL_TIME}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default AddJobs;
