import { Form, Link, useSubmit } from "react-router-dom";
import { JOB_SORT_BY, JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import FormRow from "./FormRow";
import FormRowSelect from "./FormRowSelect";
import SubmitBtn from "./SubmitBtn";
import { useAllJobsContext } from "../pages/AllJobs";
import JobsContainer from "./JobsContainer";

const SearchContainer = () => {
  const { searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues;
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000);
    };
  };

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">Search Form</h5>
        <div className="form-center">
          <FormRow type="search" name="search" defaultValue={search} />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            list={["all", ...Object.values(JOB_STATUS)]}
            onChange={debounce((form) => {
              submit(form);
            })}
            defaultValue={jobStatus}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            list={["all", ...Object.values(JOB_TYPE)]}
            onChange={(e) => submit(e.currentTarget.form)}
            defaultValue={jobType}
          />
          <FormRowSelect
            name="sort"
            list={[...Object.values(JOB_SORT_BY)]}
            onChange={(e) => submit(e.currentTarget.form)}
            defaultValue={sort}
          />

          <Link className="btn form-btn delete-btn">Reset</Link>
        </div>
      </Form>
    </Wrapper>
  );
};
export default SearchContainer;
